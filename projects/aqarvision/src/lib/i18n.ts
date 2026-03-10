import type { AgencyLocale } from '@/types/database';

const translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.properties': 'Biens',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'hero.cta': 'Découvrir nos biens',
    'properties.title': 'Nos biens d\'exception',
    'properties.portfolio': 'Portfolio',
    'properties.all': 'Tous nos biens',
    'properties.available': '{count} bien{plural} disponible{plural}',
    'properties.none': 'Aucun bien disponible pour le moment.',
    'properties.viewAll': 'Voir tous les biens',
    'properties.sale': 'Vente',
    'properties.rent': 'Location',
    'properties.similar': 'Biens similaires',
    'properties.noPhoto': 'Pas de photo',
    'about.title': 'Notre histoire',
    'about.heading': 'À propos de {name}',
    'about.years': 'Années d\'expérience',
    'about.sold': 'Biens vendus',
    'about.clients': 'Clients satisfaits',
    'contact.title': 'Contact',
    'contact.heading': 'Nous contacter',
    'contact.sendMessage': 'Envoyez-nous un message',
    'contact.phone': 'Téléphone',
    'contact.email': 'Email',
    'contact.website': 'Site web',
    'contact.address': 'Adresse',
    'form.name': 'Nom complet',
    'form.phone': 'Téléphone',
    'form.email': 'Email (optionnel)',
    'form.message': 'Message (optionnel)',
    'form.submit': 'Envoyer le message',
    'form.sending': 'Envoi en cours...',
    'form.success': 'Message envoyé avec succès ! Nous vous recontacterons rapidement.',
    'form.error': 'Erreur lors de l\'envoi',
    'pagination.prev': 'Précédent',
    'pagination.next': 'Suivant',
    'pagination.page': 'Page {current} / {total}',
    'detail.interested': 'Intéressé par ce bien ?',
    'detail.contactAgency': 'Contactez {name} directement',
    'detail.whatsapp': 'Contacter via WhatsApp',
    'detail.description': 'Description',
    'footer.rights': 'Tous droits réservés.',
    'a11y.skipToContent': 'Aller au contenu principal',
    'a11y.openMenu': 'Ouvrir le menu',
    'a11y.closeMenu': 'Fermer le menu',
    'a11y.playVideo': 'Lire la vidéo',
    'a11y.whatsapp': 'Contacter via WhatsApp',
    'error.notFound': 'Page introuvable',
    'error.generic': 'Une erreur est survenue',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'hero.cta': 'اكتشف عقاراتنا',
    'properties.title': 'عقاراتنا المميزة',
    'properties.portfolio': 'المحفظة',
    'properties.all': 'جميع العقارات',
    'properties.available': '{count} عقار{plural} متاح{plural}',
    'properties.none': 'لا توجد عقارات متاحة حالياً.',
    'properties.viewAll': 'عرض جميع العقارات',
    'properties.sale': 'بيع',
    'properties.rent': 'إيجار',
    'properties.similar': 'عقارات مشابهة',
    'properties.noPhoto': 'بدون صورة',
    'about.title': 'قصتنا',
    'about.heading': 'عن {name}',
    'about.years': 'سنوات من الخبرة',
    'about.sold': 'عقارات مباعة',
    'about.clients': 'عملاء راضون',
    'contact.title': 'اتصل بنا',
    'contact.heading': 'تواصل معنا',
    'contact.sendMessage': 'أرسل لنا رسالة',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',
    'contact.website': 'الموقع الإلكتروني',
    'contact.address': 'العنوان',
    'form.name': 'الاسم الكامل',
    'form.phone': 'الهاتف',
    'form.email': 'البريد الإلكتروني (اختياري)',
    'form.message': 'الرسالة (اختياري)',
    'form.submit': 'إرسال الرسالة',
    'form.sending': 'جاري الإرسال...',
    'form.success': 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
    'form.error': 'خطأ في الإرسال',
    'pagination.prev': 'السابق',
    'pagination.next': 'التالي',
    'pagination.page': 'صفحة {current} / {total}',
    'detail.interested': 'مهتم بهذا العقار؟',
    'detail.contactAgency': 'تواصل مع {name} مباشرة',
    'detail.whatsapp': 'تواصل عبر واتساب',
    'detail.description': 'الوصف',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'a11y.skipToContent': 'انتقل إلى المحتوى الرئيسي',
    'a11y.openMenu': 'فتح القائمة',
    'a11y.closeMenu': 'إغلاق القائمة',
    'a11y.playVideo': 'تشغيل الفيديو',
    'a11y.whatsapp': 'تواصل عبر واتساب',
    'error.notFound': 'الصفحة غير موجودة',
    'error.generic': 'حدث خطأ',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

/**
 * Retourne une fonction de traduction pour la locale donnée.
 * Usage: const t = getTranslations('ar'); t('nav.home') → 'الرئيسية'
 */
export function getTranslations(locale: AgencyLocale = 'fr') {
  const dict = translations[locale] || translations.fr;

  return function t(key: TranslationKey, params?: Record<string, string | number>): string {
    let text = dict[key] || translations.fr[key] || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return text;
  };
}

/** Retourne true si la locale utilise une écriture RTL */
export function isRtlLocale(locale: AgencyLocale): boolean {
  return locale === 'ar';
}

/** Retourne les attributs HTML dir et lang pour la locale */
export function getLocaleAttrs(locale: AgencyLocale): { dir: 'ltr' | 'rtl'; lang: string } {
  if (locale === 'ar') return { dir: 'rtl', lang: 'ar-DZ' };
  return { dir: 'ltr', lang: 'fr-DZ' };
}
