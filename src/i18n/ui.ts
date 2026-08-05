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
  "home" | "methodologie" | "fonctionnement" | "niveaux" | "carteDeSuivi" | "telechargements" | "contact" | "mentions",
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
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
