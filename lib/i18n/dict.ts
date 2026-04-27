/**
 * Tiny, dependency-free i18n.
 */

export type Locale = "en" | "nl";

export const LOCALES: Locale[] = ["en", "nl"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  nl: "NL",
};

interface FeatureRow {
  title: string;
  body: string;
}

interface Strings {
  signIn: string;
  underConstruction: string;
  badge: string;
  headline: string;
  subhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
  forWhomEyebrow: string;
  forWhomTitle: string;
  forWhomLead: string;
  features: FeatureRow[];
  previewLabel: string;
  previewGallery: string;
  previewMeta: string;
  previewBy: string;
  closingEyebrow: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
  footerLegal: string;
  footerContact: string;
  footerRights: string;
}

export const dict: Record<Locale, Strings> = {
  en: {
    signIn: "Sign in",
    underConstruction: "Under construction · launching soon",
    badge: "Private beta",
    headline: "Photos, finally delivered with care.",
    subhead:
      "Dunora is a calm, branded delivery platform for the people who actually deliver photos. Built slowly, opened by invitation, and made to disappear behind your work.",
    ctaPrimary: "Request beta access",
    ctaSecondary: "Sign in",
    scrollHint: "More below",
    forWhomEyebrow: "Who it is for",
    forWhomTitle: "Made for everyone whose work deserves better delivery.",
    forWhomLead:
      "Whether the photos are yours or you commission them, Dunora gets out of the way and lets the work do the talking. No clutter, no bloat, no compromise on how it looks when it lands.",
    features: [
      {
        title: "Branded by default",
        body: "Every gallery wears your name, your colour, your tone. Clients land on something that looks like you, not us.",
      },
      {
        title: "Calm by design",
        body: "No popups, no upsells, no busy interface. The photos lead. Everything else gets out of the way.",
      },
      {
        title: "Private by default",
        body: "Galleries are password-gated, links are unguessable, and visibility is yours to set. Nothing public unless you decide.",
      },
    ],
    previewLabel: "Preview",
    previewGallery: "Match Day",
    previewMeta: "184 photos · delivered yesterday",
    previewBy: "Powered by Dunora",
    closingEyebrow: "Coming soon",
    closingTitle: "We are building this carefully.",
    closingBody:
      "Right now Dunora is in private beta. If you want to be among the first to use it for your delivery, send us a message and tell us a little about your work.",
    closingCta: "Get in touch",
    footerLegal: "Terms",
    footerContact: "Contact",
    footerRights: "All rights reserved.",
  },
  nl: {
    signIn: "Inloggen",
    underConstruction: "In aanbouw · binnenkort live",
    badge: "Private beta",
    headline: "Foto's, eindelijk netjes geleverd.",
    subhead:
      "Dunora is een rustig leveringsplatform met jouw eigen merk voor mensen die foto's écht leveren. Langzaam gebouwd, op uitnodiging geopend, en gemaakt om achter jouw werk te verdwijnen.",
    ctaPrimary: "Beta-toegang aanvragen",
    ctaSecondary: "Inloggen",
    scrollHint: "Meer hieronder",
    forWhomEyebrow: "Voor wie",
    forWhomTitle: "Voor iedereen wiens werk een betere levering verdient.",
    forWhomLead:
      "Of je nu zelf de foto's maakt of ze laat maken, Dunora gaat uit de weg en laat het werk spreken. Geen rommel, geen overbodige knoppen, geen concessies aan hoe het oogt als de klant 'm opent.",
    features: [
      {
        title: "Jouw merk, niet het onze",
        body: "Elke galerij draagt jouw naam, kleur en stijl. Je klant komt aan op iets dat eruitziet als jouw werk, niet als ons platform.",
      },
      {
        title: "Rustig ontwerp",
        body: "Geen pop-ups, geen reclame, geen drukke interface. De foto's nemen de leiding. De rest gaat uit de weg.",
      },
      {
        title: "Standaard privé",
        body: "Galerijen zijn met wachtwoord beveiligd, links zijn niet te raden, en jij bepaalt wat openbaar is. Niks gaat naar buiten zonder dat jij dat zegt.",
      },
    ],
    previewLabel: "Voorbeeld",
    previewGallery: "Match Day",
    previewMeta: "184 foto's · gisteren geleverd",
    previewBy: "Mogelijk gemaakt door Dunora",
    closingEyebrow: "Binnenkort",
    closingTitle: "We bouwen dit met zorg.",
    closingBody:
      "Op dit moment is Dunora in private beta. Wil je tot de eersten behoren die het inzetten voor hun eigen levering, stuur ons een bericht en vertel kort iets over je werk.",
    closingCta: "Neem contact op",
    footerLegal: "Voorwaarden",
    footerContact: "Contact",
    footerRights: "Alle rechten voorbehouden.",
  },
};

export function getStrings(locale: Locale): Strings {
  return dict[locale] ?? dict.en;
}
