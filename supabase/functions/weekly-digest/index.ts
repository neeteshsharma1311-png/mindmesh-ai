import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, username")
      .eq("id", userId)
      .single();

    const userName = profile?.full_name || profile?.username || "User";

    // Fetch last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    // Fetch cognitive metrics
    const { data: metrics } = await supabase
      .from("cognitive_metrics")
      .select("focus_score, energy_level, productivity, stress_level, recorded_at")
      .eq("user_id", userId)
      .gte("recorded_at", sevenDaysAgoStr)
      .order("recorded_at", { ascending: true });

    // Fetch mood entries
    const { data: moodEntries } = await supabase
      .from("mood_entries")
      .select("mood_score, anxiety_level, stress_level, energy_level, created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgoStr)
      .order("created_at", { ascending: true });

    // Fetch productivity sessions
    const { data: sessions } = await supabase
      .from("productivity_sessions")
      .select("duration_minutes, focus_score, category, start_time")
      .eq("user_id", userId)
      .gte("start_time", sevenDaysAgoStr);

    // Fetch completed goals
    const { data: goals } = await supabase
      .from("goals")
      .select("title, status, updated_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .gte("updated_at", sevenDaysAgoStr);

    // Calculate averages
    const avgFocus = metrics?.length 
      ? Math.round(metrics.reduce((a, b) => a + (b.focus_score || 0), 0) / metrics.length)
      : 0;
    const avgProductivity = metrics?.length
      ? Math.round(metrics.reduce((a, b) => a + (b.productivity || 0), 0) / metrics.length)
      : 0;
    const avgEnergy = metrics?.length
      ? Math.round(metrics.reduce((a, b) => a + (b.energy_level || 0), 0) / metrics.length)
      : 0;
    const avgStress = metrics?.length
      ? Math.round(metrics.reduce((a, b) => a + (b.stress_level || 0), 0) / metrics.length)
      : 0;
    
    const avgMood = moodEntries?.length
      ? (moodEntries.reduce((a, b) => a + b.mood_score, 0) / moodEntries.length).toFixed(1)
      : "N/A";

    const totalFocusTime = sessions?.reduce((a, b) => a + (b.duration_minutes || 0), 0) || 0;
    const totalSessions = sessions?.length || 0;
    const avgSessionFocus = sessions?.length
      ? Math.round(sessions.reduce((a, b) => a + (b.focus_score || 0), 0) / sessions.length)
      : 0;

    const goalsCompleted = goals?.length || 0;

    // Generate AI insights
    const prompt = `You are a cognitive performance coach. Based on this week's data, provide personalized insights and actionable recommendations.

Weekly Performance Summary for ${userName}:
- Average Focus Score: ${avgFocus}%
- Average Productivity: ${avgProductivity}%
- Average Energy Level: ${avgEnergy}%
- Average Stress Level: ${avgStress}%
- Average Mood: ${avgMood}/5
- Total Focus Time: ${totalFocusTime} minutes across ${totalSessions} sessions
- Average Session Focus: ${avgSessionFocus}%
- Goals Completed: ${goalsCompleted}

Mood Entries: ${moodEntries?.length || 0} check-ins this week
Productivity Sessions: ${sessions?.map(s => `${s.category}: ${s.duration_minutes}min`).join(', ') || 'None recorded'}

Please provide:
1. A brief congratulatory message highlighting achievements
2. Key insights about their cognitive patterns
3. 3 specific, actionable recommendations for next week
4. One motivational quote related to their performance

Keep the tone friendly, supportive, and encouraging. Use emojis sparingly.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a friendly cognitive performance coach providing weekly insights." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error("Failed to generate AI insights");
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices?.[0]?.message?.content || "Unable to generate insights at this time.";

    // Return the digest data
    const digest = {
      userName,
      weekEnding: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      summary: {
        avgFocus,
        avgProductivity,
        avgEnergy,
        avgStress,
        avgMood,
        totalFocusTime,
        totalSessions,
        avgSessionFocus,
        goalsCompleted,
        moodCheckIns: moodEntries?.length || 0,
      },
      insights,
    };

    return new Response(JSON.stringify(digest), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weekly digest error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate digest" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
