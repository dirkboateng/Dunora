/**
 * Tiny, dependency-free i18n.
 */

export type Locale = "en" | "nl";

export const LOCALES: Locale[] = ["en", "nl"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  nl: "NL",
};

interface Strings {
  signIn: string;
  underConstructionBanner: string;
  badge: string;
  headline: string;
  subhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  pillars: {
    branded: { title: string; caption: string };
    fast: { title: string; caption: string };
    private: { title: string; caption: string };
  };
  previewLabel: string;
  previewCaption: string;
  previewGalleryTitle: string;
  previewGalleryMeta: string;
  audienceTitle: string;
  audienceLead: string;
  footerLegal: string;
  footerContact: string;
  footerRights: string;
}

export const dict: Record<Locale, Strings> = {
  en: {
    signIn: "Sign in",
    underConstructionBanner: "Under construction · launching soon",
    badge: "Private beta",
    headline: "A quieter way to deliver photos.",
    subhead:
      "Dunora is being built for anyone who needs to deliver polished, branded photo galleries without the noise of bloated tools. We are opening this up carefully, by invitation, for now.",
    ctaPrimary: "Request beta access",
    ctaSecondary: "Already invited? Sign in",
    pillars: {
      branded: { title: "Branded", caption: "Your studio, your style." },
      fast: { title: "Fast", caption: "Drag-drop uploads. No fuss." },
      private: { title: "Private", caption: "Password-gated by default." },
    },
    previewLabel: "Preview",
    previewCaption:
      "A glimpse of how a finished client gallery looks. Clean, fast, and entirely in your branding.",
    previewGalleryTitle: "Summer Wedding",
    previewGalleryMeta: "128 photos · delivered yesterday",
    audienceTitle: "Built for everyone who delivers photos",
    audienceLead:
      "Whatever you shoot and whoever you deliver to — Dunora gets out of your way and lets your work speak for itself.",
    footerLegal: "Legal",
    footerContact: "Contact",
    footerRights: "All rights reserved.",
  },
  nl: {
    signIn: "Inloggen",
    underConstructionBanner: "In aanbouw · binnenkort live",
    badge: "Private beta",
    headline: "Een rustigere manier om foto's te leveren.",
    subhead:
      "Dunora is in ontwikkeling voor iedereen die strakke, branded foto-galerijen wil leveren zonder de drukte van logge tools. We openen het rustig, op uitnodiging.",
    ctaPrimary: "Beta-toegang aanvragen",
    ctaSecondary: "Al uitgenodigd? Inloggen",
    pillars: {
      branded: { title: "Branded", caption: "Jouw studio, jouw stijl." },
      fast: { title: "Snel", caption: "Drag-and-drop. Geen gedoe." },
      private: { title: "Privé", caption: "Standaard met wachtwoord." },
    },
    previewLabel: "Preview",
    previewCaption:
      "Een blik op hoe een afgeronde client-galerij eruitziet. Schoon, snel en helemaal in jouw branding.",
    previewGalleryTitle: "Zomerbruiloft",
    previewGalleryMeta: "128 foto's · gisteren geleverd",
    audienceTitle: "Voor iedereen die foto's levert",
    audienceLead:
      "Wat je ook fotografeert en aan wie je ook levert — Dunora gaat uit je weg en laat je werk voor zich spreken.",
    footerLegal: "Voorwaarden",
    footerContact: "Contact",
    footerRights: "Alle rechten voorbehouden.",
  },
};

export function getStrings(locale: Locale): Strings {
  return dict[locale] ?? dict.en;
}
