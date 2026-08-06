import type { Lang } from "../../i18n/ui";

const GOLD = "#d4941f";
const INK = "#14181e";
const MUTED = "#6b7280";

interface EmailCopy {
  subject: string;
  heading: string;
  intro: string;
  button: string;
  fallback: string;
  expiry: string;
  ignore: string;
}

const copy: Record<Lang, EmailCopy> = {
  fr: {
    subject: "Confirme ton inscription — Bitaqat Hifd Qor'an",
    heading: "Confirme ton inscription",
    intro:
      "Tu as demandé à recevoir les actualités du projet Bitaqat Hifd Qor'an. Clique sur le bouton ci-dessous pour confirmer ton adresse.",
    button: "Confirmer mon inscription",
    fallback: "Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :",
    expiry: "Ce lien est valable 24 heures.",
    ignore: "Si tu n'es pas à l'origine de cette demande, ignore simplement cet email : aucune adresse ne sera enregistrée.",
  },
  en: {
    subject: "Confirm your subscription — Bitaqat Hifd Qor'an",
    heading: "Confirm your subscription",
    intro:
      "You asked to receive news from the Bitaqat Hifd Qor'an project. Click the button below to confirm your address.",
    button: "Confirm my subscription",
    fallback: "If the button does not work, copy this link into your browser:",
    expiry: "This link is valid for 24 hours.",
    ignore: "If you did not make this request, simply ignore this email: no address will be stored.",
  },
  ar: {
    subject: "أكّد اشتراكك — بطاقة حفظ القرآن",
    heading: "أكّد اشتراكك",
    intro: "لقد طلبت تلقّي أخبار مشروع بطاقة حفظ القرآن. اضغط على الزر أدناه لتأكيد عنوانك.",
    button: "تأكيد الاشتراك",
    fallback: "إذا لم يعمل الزر، انسخ هذا الرابط في متصفحك:",
    expiry: "هذا الرابط صالح لمدة 24 ساعة.",
    ignore: "إذا لم تكن أنت من قدّم هذا الطلب، فتجاهل هذه الرسالة: لن يُسجَّل أي عنوان.",
  },
};

/** Minimal escaping: the only interpolated value is a URL we build ourselves, but the
 *  templates are shared with subscriber-facing copy, so keep it safe by default. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildConfirmEmail(lang: Lang, confirmUrl: string) {
  const c = copy[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const align = lang === "ar" ? "right" : "left";
  const url = escapeHtml(confirmUrl);

  const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
  <body style="margin:0;padding:0;background:#f7f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;padding:32px;text-align:${align};">
            <tr>
              <td style="font-size:18px;font-weight:700;color:${INK};padding-bottom:8px;">Bitaqat Hifd Qor'an</td>
            </tr>
            <tr>
              <td style="font-size:22px;font-weight:800;color:${INK};padding-bottom:16px;">${c.heading}</td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:24px;">${c.intro}</td>
            </tr>
            <tr>
              <td style="padding-bottom:24px;">
                <a href="${url}" style="display:inline-block;background:${GOLD};color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:9999px;">${c.button}</a>
              </td>
            </tr>
            <tr>
              <td style="font-size:13px;line-height:1.6;color:${MUTED};padding-bottom:8px;">${c.fallback}</td>
            </tr>
            <tr>
              <td style="font-size:13px;line-height:1.6;padding-bottom:24px;word-break:break-all;">
                <a href="${url}" style="color:${GOLD};">${url}</a>
              </td>
            </tr>
            <tr>
              <td style="font-size:13px;line-height:1.6;color:${MUTED};border-top:1px solid #e5e7eb;padding-top:16px;">
                ${c.expiry}<br />${c.ignore}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${c.heading}

${c.intro}

${confirmUrl}

${c.expiry}
${c.ignore}`;

  return { subject: c.subject, html, text };
}
