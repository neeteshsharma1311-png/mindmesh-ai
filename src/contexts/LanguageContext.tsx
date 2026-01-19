import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'hi' | 'ar' | 'pt' | 'ru' | 'ko' | 'it';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home', es: 'Inicio', fr: 'Accueil', de: 'Startseite', 
    ja: 'ホーム', zh: '首页', hi: 'होम', ar: 'الرئيسية',
    pt: 'Início', ru: 'Главная', ko: '홈', it: 'Home'
  },
  'nav.dashboard': {
    en: 'Dashboard', es: 'Panel', fr: 'Tableau de bord', de: 'Dashboard',
    ja: 'ダッシュボード', zh: '仪表板', hi: 'डैशबोर्ड', ar: 'لوحة التحكم',
    pt: 'Painel', ru: 'Панель', ko: '대시보드', it: 'Dashboard'
  },
  'nav.settings': {
    en: 'Settings', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen',
    ja: '設定', zh: '设置', hi: 'सेटिंग्स', ar: 'الإعدادات',
    pt: 'Configurações', ru: 'Настройки', ko: '설정', it: 'Impostazioni'
  },
  'nav.analytics': {
    en: 'Analytics', es: 'Análisis', fr: 'Analytique', de: 'Analytik',
    ja: '分析', zh: '分析', hi: 'विश्लेषण', ar: 'التحليلات',
    pt: 'Análise', ru: 'Аналитика', ko: '분석', it: 'Analisi'
  },
  'nav.signOut': {
    en: 'Sign Out', es: 'Cerrar sesión', fr: 'Déconnexion', de: 'Abmelden',
    ja: 'サインアウト', zh: '退出', hi: 'साइन आउट', ar: 'تسجيل الخروج',
    pt: 'Sair', ru: 'Выйти', ko: '로그아웃', it: 'Esci'
  },
  'nav.profile': {
    en: 'Profile', es: 'Perfil', fr: 'Profil', de: 'Profil',
    ja: 'プロフィール', zh: '个人资料', hi: 'प्रोफ़ाइल', ar: 'الملف الشخصي',
    pt: 'Perfil', ru: 'Профиль', ko: '프로필', it: 'Profilo'
  },
  
  // Hero Section
  'hero.title': {
    en: 'Elevate Your Mind', es: 'Eleva Tu Mente', fr: 'Élevez Votre Esprit',
    de: 'Erhebe Deinen Geist', ja: '心を高める', zh: '提升你的心智',
    hi: 'अपने मन को ऊंचा करें', ar: 'ارفع عقلك',
    pt: 'Eleve Sua Mente', ru: 'Возвысьте Свой Разум', ko: '마음을 높이세요', it: 'Eleva la Tua Mente'
  },
  'hero.subtitle': {
    en: 'With Neural Intelligence', es: 'Con Inteligencia Neural',
    fr: 'Avec l\'Intelligence Neurale', de: 'Mit Neuronaler Intelligenz',
    ja: 'ニューラルインテリジェンスで', zh: '借助神经智能',
    hi: 'न्यूरल इंटेलिजेंस के साथ', ar: 'مع الذكاء العصبي',
    pt: 'Com Inteligência Neural', ru: 'С Нейронным Интеллектом', ko: '신경 지능과 함께', it: 'Con Intelligenza Neurale'
  },
  'hero.description': {
    en: 'Experience the future of cognitive enhancement. MindMesh AI analyzes your mental patterns to boost focus, productivity, and well-being.',
    es: 'Experimenta el futuro de la mejora cognitiva. MindMesh AI analiza tus patrones mentales para mejorar el enfoque, la productividad y el bienestar.',
    fr: 'Découvrez le futur de l\'amélioration cognitive. MindMesh AI analyse vos schémas mentaux pour améliorer la concentration, la productivité et le bien-être.',
    de: 'Erlebe die Zukunft der kognitiven Verbesserung. MindMesh AI analysiert deine mentalen Muster, um Fokus, Produktivität und Wohlbefinden zu steigern.',
    ja: '認知機能強化の未来を体験してください。MindMesh AIはあなたの精神パターンを分析し、集中力、生産性、幸福感を向上させます。',
    zh: '体验认知增强的未来。MindMesh AI分析您的心理模式，提升专注力、生产力和幸福感。',
    hi: 'संज्ञानात्मक वृद्धि के भविष्य का अनुभव करें। MindMesh AI आपके मानसिक पैटर्न का विश्लेषण करता है।',
    ar: 'اختبر مستقبل التعزيز المعرفي. يحلل MindMesh AI أنماطك العقلية لتعزيز التركيز والإنتاجية والرفاهية.',
    pt: 'Experimente o futuro do aprimoramento cognitivo. O MindMesh AI analisa seus padrões mentais para aumentar o foco, produtividade e bem-estar.',
    ru: 'Испытайте будущее когнитивного улучшения. MindMesh AI анализирует ваши ментальные паттерны для повышения концентрации, продуктивности и благополучия.',
    ko: '인지 향상의 미래를 경험하세요. MindMesh AI는 집중력, 생산성 및 웰빙을 높이기 위해 정신 패턴을 분석합니다.',
    it: 'Sperimenta il futuro del potenziamento cognitivo. MindMesh AI analizza i tuoi schemi mentali per aumentare focus, produttività e benessere.'
  },
  'hero.getStarted': {
    en: 'Get Started', es: 'Comenzar', fr: 'Commencer', de: 'Loslegen',
    ja: '始める', zh: '开始', hi: 'शुरू करें', ar: 'ابدأ',
    pt: 'Começar', ru: 'Начать', ko: '시작하기', it: 'Inizia'
  },
  'hero.liveDemo': {
    en: 'Live Demo', es: 'Demo en Vivo', fr: 'Démo en Direct', de: 'Live-Demo',
    ja: 'ライブデモ', zh: '现场演示', hi: 'लाइव डेमो', ar: 'عرض مباشر',
    pt: 'Demo ao Vivo', ru: 'Демо', ko: '라이브 데모', it: 'Demo Live'
  },
  'hero.voiceAI': {
    en: 'Try Voice AI', es: 'Probar IA de Voz', fr: 'Essayer l\'IA Vocale',
    de: 'Sprach-KI testen', ja: '音声AIを試す', zh: '试用语音AI',
    hi: 'वॉइस AI आज़माएं', ar: 'جرب الذكاء الصوتي',
    pt: 'Experimente IA de Voz', ru: 'Попробуйте Голосовой ИИ', ko: '음성 AI 체험', it: 'Prova l\'IA Vocale'
  },
  
  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome back', es: 'Bienvenido de nuevo', fr: 'Bienvenue',
    de: 'Willkommen zurück', ja: 'おかえりなさい', zh: '欢迎回来',
    hi: 'वापसी पर स्वागत है', ar: 'مرحباً بعودتك',
    pt: 'Bem-vindo de volta', ru: 'С возвращением', ko: '다시 오신 것을 환영합니다', it: 'Bentornato'
  },
  'dashboard.focusScore': {
    en: 'Focus Score', es: 'Puntuación de Enfoque', fr: 'Score de Concentration',
    de: 'Fokus-Punktzahl', ja: 'フォーカススコア', zh: '专注分数',
    hi: 'फोकस स्कोर', ar: 'درجة التركيز',
    pt: 'Pontuação de Foco', ru: 'Оценка Фокуса', ko: '집중 점수', it: 'Punteggio Focus'
  },
  'dashboard.productivity': {
    en: 'Productivity', es: 'Productividad', fr: 'Productivité',
    de: 'Produktivität', ja: '生産性', zh: '生产力',
    hi: 'उत्पादकता', ar: 'الإنتاجية',
    pt: 'Produtividade', ru: 'Продуктивность', ko: '생산성', it: 'Produttività'
  },
  'dashboard.energy': {
    en: 'Energy Level', es: 'Nivel de Energía', fr: 'Niveau d\'Énergie',
    de: 'Energieniveau', ja: 'エネルギーレベル', zh: '能量水平',
    hi: 'ऊर्जा स्तर', ar: 'مستوى الطاقة',
    pt: 'Nível de Energia', ru: 'Уровень Энергии', ko: '에너지 레벨', it: 'Livello Energia'
  },
  'dashboard.stress': {
    en: 'Stress Level', es: 'Nivel de Estrés', fr: 'Niveau de Stress',
    de: 'Stressniveau', ja: 'ストレスレベル', zh: '压力水平',
    hi: 'तनाव स्तर', ar: 'مستوى التوتر',
    pt: 'Nível de Estresse', ru: 'Уровень Стресса', ko: '스트레스 수준', it: 'Livello Stress'
  },
  'dashboard.goals': {
    en: 'Active Goals', es: 'Objetivos Activos', fr: 'Objectifs Actifs',
    de: 'Aktive Ziele', ja: 'アクティブな目標', zh: '活跃目标',
    hi: 'सक्रिय लक्ष्य', ar: 'الأهداف النشطة',
    pt: 'Metas Ativas', ru: 'Активные Цели', ko: '활성 목표', it: 'Obiettivi Attivi'
  },
  'dashboard.newGoal': {
    en: 'New Goal', es: 'Nuevo Objetivo', fr: 'Nouvel Objectif',
    de: 'Neues Ziel', ja: '新しい目標', zh: '新目标',
    hi: 'नया लक्ष्य', ar: 'هدف جديد',
    pt: 'Nova Meta', ru: 'Новая Цель', ko: '새 목표', it: 'Nuovo Obiettivo'
  },
  'dashboard.noGoals': {
    en: 'No active goals', es: 'Sin objetivos activos', fr: 'Aucun objectif actif',
    de: 'Keine aktiven Ziele', ja: 'アクティブな目標がありません', zh: '没有活跃目标',
    hi: 'कोई सक्रिय लक्ष्य नहीं', ar: 'لا توجد أهداف نشطة',
    pt: 'Sem metas ativas', ru: 'Нет активных целей', ko: '활성 목표 없음', it: 'Nessun obiettivo attivo'
  },
  'dashboard.createGoal': {
    en: 'Create Goal', es: 'Crear Objetivo', fr: 'Créer Objectif',
    de: 'Ziel Erstellen', ja: '目標を作成', zh: '创建目标',
    hi: 'लक्ष्य बनाएं', ar: 'إنشاء هدف',
    pt: 'Criar Meta', ru: 'Создать Цель', ko: '목표 만들기', it: 'Crea Obiettivo'
  },
  'dashboard.performance': {
    en: 'Your cognitive performance is', es: 'Tu rendimiento cognitivo es',
    fr: 'Votre performance cognitive est', de: 'Deine kognitive Leistung ist',
    ja: 'あなたの認知パフォーマンスは', zh: '您的认知表现是',
    hi: 'आपका संज्ञानात्मक प्रदर्शन है', ar: 'أداؤك المعرفي هو',
    pt: 'Seu desempenho cognitivo está', ru: 'Ваша когнитивная производительность',
    ko: '인지 수행 능력은', it: 'Le tue prestazioni cognitive sono'
  },
  'dashboard.excellent': {
    en: 'excellent', es: 'excelente', fr: 'excellent', de: 'ausgezeichnet',
    ja: '優秀', zh: '优秀', hi: 'उत्कृष्ट', ar: 'ممتاز',
    pt: 'excelente', ru: 'отлично', ko: '우수함', it: 'eccellente'
  },
  'dashboard.improving': {
    en: 'improving', es: 'mejorando', fr: 'en amélioration', de: 'verbessernd',
    ja: '改善中', zh: '正在改善', hi: 'सुधार हो रहा है', ar: 'يتحسن',
    pt: 'melhorando', ru: 'улучшается', ko: '개선 중', it: 'in miglioramento'
  },
  
  // Settings
  'settings.title': {
    en: 'Settings', es: 'Configuración', fr: 'Paramètres', de: 'Einstellungen',
    ja: '設定', zh: '设置', hi: 'सेटिंग्स', ar: 'الإعدادات',
    pt: 'Configurações', ru: 'Настройки', ko: '설정', it: 'Impostazioni'
  },
  'settings.profile': {
    en: 'Profile', es: 'Perfil', fr: 'Profil', de: 'Profil',
    ja: 'プロフィール', zh: '个人资料', hi: 'प्रोफ़ाइल', ar: 'الملف الشخصي',
    pt: 'Perfil', ru: 'Профиль', ko: '프로필', it: 'Profilo'
  },
  'settings.appearance': {
    en: 'Appearance', es: 'Apariencia', fr: 'Apparence', de: 'Erscheinungsbild',
    ja: '外観', zh: '外观', hi: 'उपस्थिति', ar: 'المظهر',
    pt: 'Aparência', ru: 'Внешний вид', ko: '모양', it: 'Aspetto'
  },
  'settings.notifications': {
    en: 'Notifications', es: 'Notificaciones', fr: 'Notifications',
    de: 'Benachrichtigungen', ja: '通知', zh: '通知',
    hi: 'सूचनाएं', ar: 'الإشعارات',
    pt: 'Notificações', ru: 'Уведомления', ko: '알림', it: 'Notifiche'
  },
  'settings.privacy': {
    en: 'Privacy', es: 'Privacidad', fr: 'Confidentialité', de: 'Datenschutz',
    ja: 'プライバシー', zh: '隐私', hi: 'गोपनीयता', ar: 'الخصوصية',
    pt: 'Privacidade', ru: 'Конфиденциальность', ko: '개인정보', it: 'Privacy'
  },
  'settings.language': {
    en: 'Language', es: 'Idioma', fr: 'Langue', de: 'Sprache',
    ja: '言語', zh: '语言', hi: 'भाषा', ar: 'اللغة',
    pt: 'Idioma', ru: 'Язык', ko: '언어', it: 'Lingua'
  },
  'settings.save': {
    en: 'Save Changes', es: 'Guardar Cambios', fr: 'Enregistrer',
    de: 'Änderungen Speichern', ja: '変更を保存', zh: '保存更改',
    hi: 'परिवर्तन सहेजें', ar: 'حفظ التغييرات',
    pt: 'Salvar Alterações', ru: 'Сохранить', ko: '변경 저장', it: 'Salva Modifiche'
  },
  'settings.theme': {
    en: 'Theme', es: 'Tema', fr: 'Thème', de: 'Thema',
    ja: 'テーマ', zh: '主题', hi: 'थीम', ar: 'المظهر',
    pt: 'Tema', ru: 'Тема', ko: '테마', it: 'Tema'
  },
  'settings.voiceAI': {
    en: 'Voice AI', es: 'IA de Voz', fr: 'IA Vocale', de: 'Sprach-KI',
    ja: '音声AI', zh: '语音AI', hi: 'वॉइस AI', ar: 'الذكاء الصوتي',
    pt: 'IA de Voz', ru: 'Голосовой ИИ', ko: '음성 AI', it: 'IA Vocale'
  },
  'settings.pushNotifications': {
    en: 'Push Notifications', es: 'Notificaciones Push', fr: 'Notifications Push',
    de: 'Push-Benachrichtigungen', ja: 'プッシュ通知', zh: '推送通知',
    hi: 'पुश नोटिफिकेशन', ar: 'إشعارات الدفع',
    pt: 'Notificações Push', ru: 'Push-уведомления', ko: '푸시 알림', it: 'Notifiche Push'
  },
  'settings.enablePush': {
    en: 'Enable push notifications for real-time alerts',
    es: 'Habilitar notificaciones push para alertas en tiempo real',
    fr: 'Activer les notifications push pour les alertes en temps réel',
    de: 'Push-Benachrichtigungen für Echtzeit-Alerts aktivieren',
    ja: 'リアルタイムアラートのプッシュ通知を有効にする',
    zh: '启用推送通知以获取实时警报',
    hi: 'रीयल-टाइम अलर्ट के लिए पुश नोटिफिकेशन सक्षम करें',
    ar: 'تمكين إشعارات الدفع للتنبيهات الفورية',
    pt: 'Ativar notificações push para alertas em tempo real',
    ru: 'Включить push-уведомления для оповещений в реальном времени',
    ko: '실시간 알림을 위한 푸시 알림 활성화',
    it: 'Abilita le notifiche push per avvisi in tempo reale'
  },
  
  // Chat
  'chat.placeholder': {
    en: 'Type a message...', es: 'Escribe un mensaje...',
    fr: 'Tapez un message...', de: 'Nachricht eingeben...',
    ja: 'メッセージを入力...', zh: '输入消息...',
    hi: 'संदेश लिखें...', ar: 'اكتب رسالة...',
    pt: 'Digite uma mensagem...', ru: 'Введите сообщение...',
    ko: '메시지 입력...', it: 'Scrivi un messaggio...'
  },
  'chat.send': {
    en: 'Send', es: 'Enviar', fr: 'Envoyer', de: 'Senden',
    ja: '送信', zh: '发送', hi: 'भेजें', ar: 'إرسال',
    pt: 'Enviar', ru: 'Отправить', ko: '보내기', it: 'Invia'
  },
  'chat.voiceInput': {
    en: 'Voice Input', es: 'Entrada de Voz', fr: 'Entrée Vocale',
    de: 'Spracheingabe', ja: '音声入力', zh: '语音输入',
    hi: 'वॉइस इनपुट', ar: 'إدخال صوتي',
    pt: 'Entrada de Voz', ru: 'Голосовой ввод', ko: '음성 입력', it: 'Input Vocale'
  },
  'chat.newConversation': {
    en: 'New Conversation', es: 'Nueva Conversación', fr: 'Nouvelle Conversation',
    de: 'Neue Unterhaltung', ja: '新しい会話', zh: '新对话',
    hi: 'नई बातचीत', ar: 'محادثة جديدة',
    pt: 'Nova Conversa', ru: 'Новый Разговор', ko: '새 대화', it: 'Nuova Conversazione'
  },
  'chat.history': {
    en: 'Chat History', es: 'Historial de Chat', fr: 'Historique du Chat',
    de: 'Chat-Verlauf', ja: 'チャット履歴', zh: '聊天记录',
    hi: 'चैट इतिहास', ar: 'سجل الدردشة',
    pt: 'Histórico de Chat', ru: 'История Чата', ko: '채팅 기록', it: 'Cronologia Chat'
  },
  
  // Common
  'common.loading': {
    en: 'Loading...', es: 'Cargando...', fr: 'Chargement...',
    de: 'Laden...', ja: '読み込み中...', zh: '加载中...',
    hi: 'लोड हो रहा है...', ar: 'جارٍ التحميل...',
    pt: 'Carregando...', ru: 'Загрузка...', ko: '로딩 중...', it: 'Caricamento...'
  },
  'common.error': {
    en: 'Error', es: 'Error', fr: 'Erreur', de: 'Fehler',
    ja: 'エラー', zh: '错误', hi: 'त्रुटि', ar: 'خطأ',
    pt: 'Erro', ru: 'Ошибка', ko: '오류', it: 'Errore'
  },
  'common.success': {
    en: 'Success', es: 'Éxito', fr: 'Succès', de: 'Erfolg',
    ja: '成功', zh: '成功', hi: 'सफलता', ar: 'نجاح',
    pt: 'Sucesso', ru: 'Успех', ko: '성공', it: 'Successo'
  },
  'common.today': {
    en: 'today', es: 'hoy', fr: 'aujourd\'hui', de: 'heute',
    ja: '今日', zh: '今天', hi: 'आज', ar: 'اليوم',
    pt: 'hoje', ru: 'сегодня', ko: '오늘', it: 'oggi'
  },
  'common.cancel': {
    en: 'Cancel', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen',
    ja: 'キャンセル', zh: '取消', hi: 'रद्द करें', ar: 'إلغاء',
    pt: 'Cancelar', ru: 'Отмена', ko: '취소', it: 'Annulla'
  },
  'common.confirm': {
    en: 'Confirm', es: 'Confirmar', fr: 'Confirmer', de: 'Bestätigen',
    ja: '確認', zh: '确认', hi: 'पुष्टि करें', ar: 'تأكيد',
    pt: 'Confirmar', ru: 'Подтвердить', ko: '확인', it: 'Conferma'
  },
  'common.delete': {
    en: 'Delete', es: 'Eliminar', fr: 'Supprimer', de: 'Löschen',
    ja: '削除', zh: '删除', hi: 'हटाएं', ar: 'حذف',
    pt: 'Excluir', ru: 'Удалить', ko: '삭제', it: 'Elimina'
  },
  'common.edit': {
    en: 'Edit', es: 'Editar', fr: 'Modifier', de: 'Bearbeiten',
    ja: '編集', zh: '编辑', hi: 'संपादित करें', ar: 'تعديل',
    pt: 'Editar', ru: 'Редактировать', ko: '수정', it: 'Modifica'
  },
  
  // Greeting
  'greeting.morning': {
    en: 'Good morning', es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen',
    ja: 'おはようございます', zh: '早上好', hi: 'सुप्रभात', ar: 'صباح الخير',
    pt: 'Bom dia', ru: 'Доброе утро', ko: '좋은 아침', it: 'Buongiorno'
  },
  'greeting.afternoon': {
    en: 'Good afternoon', es: 'Buenas tardes', fr: 'Bon après-midi', de: 'Guten Tag',
    ja: 'こんにちは', zh: '下午好', hi: 'नमस्ते', ar: 'مساء الخير',
    pt: 'Boa tarde', ru: 'Добрый день', ko: '좋은 오후', it: 'Buon pomeriggio'
  },
  'greeting.evening': {
    en: 'Good evening', es: 'Buenas noches', fr: 'Bonsoir', de: 'Guten Abend',
    ja: 'こんばんは', zh: '晚上好', hi: 'शुभ संध्या', ar: 'مساء الخير',
    pt: 'Boa noite', ru: 'Добрый вечер', ko: '좋은 저녁', it: 'Buonasera'
  },
};

const languageNames: { [key in Language]: string } = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية',
  pt: 'Português',
  ru: 'Русский',
  ko: '한국어',
  it: 'Italiano',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: typeof languageNames;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved && saved in languageNames) return saved as Language;
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang in languageNames) return browserLang as Language;
    
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export type { Language };
