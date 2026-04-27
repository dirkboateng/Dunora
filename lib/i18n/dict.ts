/**
 * Tiny, dependency-free i18n. Add new keys here. The whole landing page
 * pulls strings from this dictionary so adding languages later is just a
 * matter of duplicating the structure for the new locale.
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
  audienceTitle: string;
  audiences: { title: string; caption: string }[];
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
      "Dunora is being built for photographers, sports clubs, event organisers and studios that want polished, branded galleries without the noise of bloated tools. We are opening this up carefully, by invitation, for now.",
    ctaPrimary: "Request beta access",
    ctaSecondary: "Already invited? Sign in",
    pillars: {
      branded: { title: "Branded", caption: "Your studio, your style." },
      fast: { title: "Fast", caption: "Drag-drop uploads. No fuss." },
      private: { title: "Private", caption: "Password-gated by default." },
    },
    previewLabel: "Preview",
    previewCaption:
      "A glimpse of what your client gallery will look like. The real thing is calmer, faster and yours to brand.",
    audienceTitle: "Built for the people who actually deliver photos",
    audiences: [
      {
        title: "Independent photographers",
        caption: "Weddings, portraits, brand work — deliver in your style.",
      },
      {
        title: "Sports clubs",
        caption: "Match galleries, season archives, supporter access.",
      },
      {
        title: "Event organisers",
        caption: "Festivals, conferences, club nights — all branded.",
      },
      {
        title: "Studios & agencies",
        caption: "Multi-photographer teams with shared client delivery.",
      },
    ],
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
      "Dunora is in ontwikkeling voor fotografen, sportclubs, eventorganisatoren en studio's die strakke, branded galerijen willen leveren zonder de drukte van logge tools. We openen het rustig, op uitnodiging.",
    ctaPrimary: "Beta-toegang aanvragen",
    ctaSecondary: "Al uitgenodigd? Inloggen",
    pillars: {
      branded: { title: "Branded", caption: "Jouw studio, jouw stijl." },
      fast: { title: "Snel", caption: "Drag-and-drop. Geen gedoe." },
      private: { title: "Privé", caption: "Standaard met wachtwoord." },
    },
    previewLabel: "Preview",
    previewCaption:
      "Een glimp van hoe een client-galerij eruitziet. Het echte ding is rustiger, sneller en helemaal in jouw branding.",
    audienceTitle: "Gemaakt voor de mensen die foto's daadwerkelijk leveren",
    audiences: [
      {
        title: "Zelfstandige fotografen",
        caption: "Bruiloften, portretten, merkwerk — geleverd in jouw stijl.",
      },
      {
        title: "Sportclubs",
        caption: "Wedstrijdgalerijen, seizoensarchief, toegang voor supporters.",
      },
      {
        title: "Eventorganisatoren",
        caption: "Festivals, congressen, clubnights — allemaal branded.",
      },
      {
        title: "Studio's & bureaus",
        caption: "Multi-fotograaf teams met gedeelde client delivery.",
      },
    ],
    footerLegal: "Voorwaarden",
    footerContact: "Contact",
    footerRights: "Alle rechten voorbehouden.",
  },
};

export function getStrings(locale: Locale): Strings {
  return dict[locale] ?? dict.en;
}
