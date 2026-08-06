export const languages = {
  fr: "Français",
  en: "English",
  ar: "العربية",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "fr";

export const dirs: Record<Lang, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
  ar: "rtl",
};

export const routes: Record<Lang, Record<
  | "home"
  | "methodologie"
  | "fonctionnement"
  | "niveaux"
  | "carteDeSuivi"
  | "telechargements"
  | "contact"
  | "mentions"
  | "newsletter"
  | "actualites",
  string
>> = {
  fr: {
    home: "/",
    methodologie: "/methodologie",
    fonctionnement: "/methodologie/fonctionnement",
    niveaux: "/methodologie/niveaux",
    carteDeSuivi: "/methodologie/carte-de-suivi",
    telechargements: "/telechargements",
    contact: "/contact",
    mentions: "/mentions-legales",
    newsletter: "/newsletter",
    actualites: "/actualites",
  },
  en: {
    home: "/en/",
    methodologie: "/en/methodology",
    fonctionnement: "/en/methodology/how-it-works",
    niveaux: "/en/methodology/levels",
    carteDeSuivi: "/en/methodology/tracking-card",
    telechargements: "/en/downloads",
    contact: "/en/contact",
    mentions: "/en/legal-notice",
    newsletter: "/en/newsletter",
    actualites: "/en/news",
  },
  ar: {
    home: "/ar/",
    methodologie: "/ar/methodology",
    fonctionnement: "/ar/methodology/how-it-works",
    niveaux: "/ar/methodology/levels",
    carteDeSuivi: "/ar/methodology/tracking-card",
    telechargements: "/ar/downloads",
    contact: "/ar/contact",
    mentions: "/ar/legal-notice",
    newsletter: "/ar/newsletter",
    actualites: "/ar/news",
  },
};

export const ui = {
  fr: {
    "nav.methodologie": "Méthodologie",
    "nav.niveaux": "Les niveaux",
    "nav.telechargements": "Téléchargements",
    "nav.contact": "Contact",
    "nav.cta": "Télécharger le kit",
    "footer.tagline":
      "Un kit d'apprentissage libre et gratuit pour la mémorisation du Qor'an, pensé pour les élèves, les parents et les professeurs.",
    "footer.project": "Le projet",
    "footer.info": "Informations",
    "footer.mentions": "Mentions légales",
    "footer.rights": "Œuvre libre, non commercialisable.",
    "footer.follow": "Suivez le projet sur X",
    "action.view": "Voir",
    "action.download": "Télécharger",
    "action.noPreview": "Pas d'aperçu",
    "theme.toggle": "Changer de thème",
    "downloads.theme": "Thème des ressources",
    "downloads.themeClair": "Clair",
    "downloads.themeNuit": "Nuit",
    "downloads.riwaya": "Riwaya",
    "downloads.riwayaHafs": "Hafs",
    "downloads.riwayaWarsh": "Warsh",
    "downloads.recto": "Recto",
    "downloads.verso": "Verso",
    "nav.actualites": "Actualités",
    "news.title": "Actualités",
    "news.desc": "Les nouveautés du projet : nouvelles cartes, outils de suivi et évolutions de la méthodologie.",
    "news.readMore": "Lire la suite",
    "news.backToList": "Toutes les actualités",
    "news.published": "Publié le",
    "news.updated": "Mis à jour le",
    "news.empty": "Aucune actualité pour le moment.",
    "news.rss": "Flux RSS",
    "news.fallbackNotice": "Cet article n'est pas encore traduit. Il est affiché dans sa version française d'origine.",
    "footer.newsletter": "Newsletter",
    "newsletter.title": "Recevoir les actualités",
    "newsletter.desc":
      "Un email à chaque nouveauté : nouvelles cartes, mises à jour de la méthodologie. Rien d'autre.",
    "newsletter.placeholder": "ton@email.com",
    "newsletter.submit": "S'inscrire",
    "newsletter.legal":
      "Ton adresse sert uniquement à l'envoi de ces actualités. Désinscription en un clic depuis chaque email.",
    "newsletter.msgInvalidEmail": "Merci de saisir une adresse email valide.",
    "newsletter.msgMissingTurnstile": "Merci de valider le contrôle de sécurité.",
    "newsletter.msgSending": "Envoi en cours…",
    "newsletter.msgSuccess": "Presque terminé ! Vérifie ta boîte mail et clique sur le lien de confirmation.",
    "newsletter.msgRateLimited": "Trop de tentatives. Réessaie dans une heure.",
    "newsletter.msgError": "Une erreur est survenue. Réessaie dans quelques instants.",
    "newsletter.pageDesc": "Inscription aux actualités du projet Bitaqat Hifd Qor'an.",
    "newsletter.confirmedTitle": "Inscription confirmée",
    "newsletter.confirmedBody":
      "Ton adresse est enregistrée. Tu recevras un email à chaque nouvelle actualité du projet.",
    "newsletter.invalidTitle": "Lien invalide ou expiré",
    "newsletter.invalidBody":
      "Ce lien de confirmation n'est plus valable — il expire au bout de 24 heures. Tu peux relancer ton inscription ci-dessous.",
    "newsletter.unsubTitle": "Se désinscrire",
    "newsletter.unsubBody": "Confirme ta désinscription pour ne plus recevoir les actualités du projet.",
    "newsletter.unsubButton": "Confirmer ma désinscription",
    "newsletter.unsubDoneTitle": "Désinscription effectuée",
    "newsletter.unsubDoneBody":
      "Ton adresse a été supprimée de la liste. Tu ne recevras plus d'email de notre part.",
    "newsletter.backHome": "Retour à l'accueil",
  },
  en: {
    "nav.methodologie": "Methodology",
    "nav.niveaux": "Levels",
    "nav.telechargements": "Downloads",
    "nav.contact": "Contact",
    "nav.cta": "Download the kit",
    "footer.tagline":
      "A free, open learning kit for Qur'an memorization, designed for students, parents and teachers.",
    "footer.project": "The project",
    "footer.info": "Information",
    "footer.mentions": "Legal notice",
    "footer.rights": "Free work, not for commercial use.",
    "footer.follow": "Follow the project on X",
    "action.view": "View",
    "action.download": "Download",
    "action.noPreview": "No preview",
    "theme.toggle": "Switch theme",
    "downloads.theme": "Resource theme",
    "downloads.themeClair": "Light",
    "downloads.themeNuit": "Dark",
    "downloads.riwaya": "Riwaya",
    "downloads.riwayaHafs": "Hafs",
    "downloads.riwayaWarsh": "Warsh",
    "downloads.recto": "Front",
    "downloads.verso": "Back",
    "nav.actualites": "News",
    "news.title": "News",
    "news.desc": "What is new in the project: new cards, tracking tools and methodology updates.",
    "news.readMore": "Read more",
    "news.backToList": "All news",
    "news.published": "Published on",
    "news.updated": "Updated on",
    "news.empty": "No news yet.",
    "news.rss": "RSS feed",
    "news.fallbackNotice": "This article has not been translated yet. It is shown in its original French.",
    "footer.newsletter": "Newsletter",
    "newsletter.title": "Get the latest news",
    "newsletter.desc":
      "One email whenever something new lands: new cards, methodology updates. Nothing else.",
    "newsletter.placeholder": "you@email.com",
    "newsletter.submit": "Subscribe",
    "newsletter.legal":
      "Your address is used only to send these updates. One-click unsubscribe from every email.",
    "newsletter.msgInvalidEmail": "Please enter a valid email address.",
    "newsletter.msgMissingTurnstile": "Please complete the security check.",
    "newsletter.msgSending": "Sending…",
    "newsletter.msgSuccess": "Almost there! Check your inbox and click the confirmation link.",
    "newsletter.msgRateLimited": "Too many attempts. Please try again in an hour.",
    "newsletter.msgError": "Something went wrong. Please try again in a moment.",
    "newsletter.pageDesc": "Subscribe to news from the Bitaqat Hifd Qor'an project.",
    "newsletter.confirmedTitle": "Subscription confirmed",
    "newsletter.confirmedBody":
      "Your address is registered. You will get an email whenever there is project news.",
    "newsletter.invalidTitle": "Invalid or expired link",
    "newsletter.invalidBody":
      "This confirmation link is no longer valid — it expires after 24 hours. You can sign up again below.",
    "newsletter.unsubTitle": "Unsubscribe",
    "newsletter.unsubBody": "Confirm below to stop receiving news from the project.",
    "newsletter.unsubButton": "Confirm unsubscribe",
    "newsletter.unsubDoneTitle": "You have been unsubscribed",
    "newsletter.unsubDoneBody": "Your address has been removed from the list. You will not hear from us again.",
    "newsletter.backHome": "Back to home",
  },
  ar: {
    "nav.methodologie": "المنهجية",
    "nav.niveaux": "المستويات",
    "nav.telechargements": "التحميلات",
    "nav.contact": "تواصل معنا",
    "nav.cta": "تحميل الحقيبة",
    "footer.tagline":
      "حقيبة تعليمية حرة ومجانية لحفظ القرآن الكريم، مصممة للطلاب وأولياء الأمور والمعلمين.",
    "footer.project": "المشروع",
    "footer.info": "معلومات",
    "footer.mentions": "الإشعار القانوني",
    "footer.rights": "عمل حر، غير مخصص للاستخدام التجاري.",
    "footer.follow": "تابع المشروع على X",
    "action.view": "عرض",
    "action.download": "تحميل",
    "action.noPreview": "لا توجد معاينة",
    "theme.toggle": "تبديل المظهر",
    "downloads.theme": "مظهر الموارد",
    "downloads.themeClair": "فاتح",
    "downloads.themeNuit": "داكن",
    "downloads.riwaya": "الرواية",
    "downloads.riwayaHafs": "حفص",
    "downloads.riwayaWarsh": "ورش",
    "downloads.recto": "الوجه",
    "downloads.verso": "الظهر",
    "nav.actualites": "الأخبار",
    "news.title": "الأخبار",
    "news.desc": "مستجدّات المشروع: بطاقات جديدة وأدوات متابعة وتحديثات المنهجية.",
    "news.readMore": "اقرأ المزيد",
    "news.backToList": "كل الأخبار",
    "news.published": "نُشر في",
    "news.updated": "حُدّث في",
    "news.empty": "لا توجد أخبار بعد.",
    "news.rss": "تدفّق RSS",
    "news.fallbackNotice": "لم تُترجَم هذه المقالة بعد. وهي معروضة بنصّها الفرنسي الأصلي.",
    "footer.newsletter": "النشرة البريدية",
    "newsletter.title": "تابع أخبار المشروع",
    "newsletter.desc": "رسالة واحدة عند كل جديد: بطاقات جديدة، تحديثات المنهجية. لا شيء غير ذلك.",
    "newsletter.placeholder": "بريدك@الإلكتروني.com",
    "newsletter.submit": "اشترك",
    "newsletter.legal":
      "يُستعمل عنوانك لإرسال هذه الأخبار فقط. يمكنك إلغاء الاشتراك بنقرة واحدة من كل رسالة.",
    "newsletter.msgInvalidEmail": "يرجى إدخال عنوان بريد إلكتروني صالح.",
    "newsletter.msgMissingTurnstile": "يرجى إتمام التحقق الأمني.",
    "newsletter.msgSending": "جارٍ الإرسال…",
    "newsletter.msgSuccess": "بقيت خطوة واحدة! تفقّد بريدك واضغط على رابط التأكيد.",
    "newsletter.msgRateLimited": "محاولات كثيرة. أعد المحاولة بعد ساعة.",
    "newsletter.msgError": "حدث خطأ. أعد المحاولة بعد لحظات.",
    "newsletter.pageDesc": "الاشتراك في أخبار مشروع بطاقة حفظ القرآن.",
    "newsletter.confirmedTitle": "تم تأكيد الاشتراك",
    "newsletter.confirmedBody": "تم تسجيل عنوانك. ستصلك رسالة عند كل خبر جديد عن المشروع.",
    "newsletter.invalidTitle": "رابط غير صالح أو منتهي الصلاحية",
    "newsletter.invalidBody":
      "لم يعد رابط التأكيد صالحًا — تنتهي صلاحيته بعد 24 ساعة. يمكنك إعادة الاشتراك أدناه.",
    "newsletter.unsubTitle": "إلغاء الاشتراك",
    "newsletter.unsubBody": "أكّد إلغاء اشتراكك لتتوقف عن تلقّي أخبار المشروع.",
    "newsletter.unsubButton": "تأكيد إلغاء الاشتراك",
    "newsletter.unsubDoneTitle": "تم إلغاء الاشتراك",
    "newsletter.unsubDoneBody": "تم حذف عنوانك من القائمة. لن تصلك أي رسالة منّا بعد الآن.",
    "newsletter.backHome": "العودة إلى الصفحة الرئيسية",
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
