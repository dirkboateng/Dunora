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
  manifesto: string;
  manifestoSignature: string;
  previewLabel: string;
  previewTitle: string;
  previewCaption: string;
  previewGalleryTitle: string;
  previewGalleryMeta: string;
  audienceTitle: string;
  audienceLead: string;
  pillars: {
    branded: { title: string; caption: string };
    fast: { title: string; caption: string };
    private: { title: string; caption: string };
  };
  ctaStripTitle: string;
  ctaStripBody: string;
  footerLegal: string;
  footerContact: string;
  footerRights: string;
}

export const dict: Record<Locale, Strings> = {
  en: {
    signIn: "Sign in",
    underConstructionBanner: "Under construction · launching soon",
    badge: "Private beta",
    headline: "Photos delivered like they deserve.",
    subhead:
      "Dunora is being built for everyone who delivers photos. Polished, branded galleries — without the noise of bloated tools. Opening carefully, by invitation.",
    ctaPrimary: "Request beta access",
    ctaSecondary: "Already invited? Sign in",
    manifesto:
      "Photography is craft. Delivery should not be where that craft gets lost.",
    manifestoSignature: "The Dunora team",
    previewLabel: "A glimpse",
    previewTitle: "What your client sees.",
    previewCaption:
      "A clean gallery in your branding. No clutter, no third-party banners, no friction. Your work in front, the rest out of the way.",
    previewGalleryTitle: "Match Day",
    previewGalleryMeta: "184 photos · delivered yesterday",
    audienceTitle: "Built around the work, not the workflow.",
    audienceLead:
      "Whether you shoot one match a year or fifty weddings a season — Dunora gets out of the way and lets the photos do the work.",
    pillars: {
      branded: {
        title: "Yours, end to end",
        caption: "Your studio name, your colors, your domain. Clients never see ours.",
      },
      fast: {
        title: "Built for speed",
        caption: "Drag, drop, share. Resumable uploads up to 200 MB per file.",
      },
      private: {
        title: "Private by default",
        caption: "Galleries are password-gated until you decide otherwise.",
      },
    },
    ctaStripTitle: "Want in?",
    ctaStripBody:
      "Send a short note. Tell us what you shoot and we'll get back to you about beta access.",
    footerLegal: "Legal",
    footerContact: "Contact",
    footerRights: "All rights reserved.",
  },
  nl: {
    signIn: "Inloggen",
    underConstructionBanner: "In aanbouw · binnenkort live",
    badge: "Private beta",
    headline: "Foto's geleverd zoals ze verdienen.",
    subhead:
      "Dunora wordt gebouwd voor iedereen die foto's levert. Strakke, branded galerijen — zonder de ruis van zware tools. We openen langzaam, op uitnodiging.",
    ctaPrimary: "Beta-toegang aanvragen",
    ctaSecondary: "Al uitgenodigd? Inloggen",
    manifesto:
      "Fotografie is een vak. De levering mag niet zijn waar dat vak verloren gaat.",
    manifestoSignature: "Het Dunora team",
    previewLabel: "Een blik",
    previewTitle: "Wat jouw klant ziet.",
    previewCaption:
      "Een opgeruimde galerij in jouw branding. Geen rommel, geen reclamebanners van derden, geen wrijving. Jouw werk vooraan, de rest opzij.",
    previewGalleryTitle: "Match Day",
    previewGalleryMeta: "184 foto's · gisteren geleverd",
    audienceTitle: "Gebouwd rond het werk, niet rond de tool.",
    audienceLead:
      "Of je nu één wedstrijd per jaar fotografeert of vijftig bruiloften per seizoen — Dunora stapt opzij en laat de foto's hun werk doen.",
    pillars: {
      branded: {
        title: "Helemaal van jou",
        caption: "Jouw studio, jouw kleuren, jouw domein. De klant ziet ons niet.",
      },
      fast: {
        title: "Gemaakt voor snelheid",
        caption: "Sleep, plaats, deel. Hervatbare uploads tot 200 MB per bestand.",
      },
      private: {
        title: "Standaard privé",
        caption: "Galerijen zijn afgeschermd met wachtwoord tot jij anders beslist.",
      },
    },
    ctaStripTitle: "Mee doen?",
    ctaStripBody:
      "Stuur een kort bericht. Vertel wat je fotografeert en we komen bij je terug over beta-toegang.",
    footerLegal: "Voorwaarden",
    footerContact: "Contact",
    footerRights: "Alle rechten voorbehouden.",
  },
};

export function getStrings(locale: Locale): Strings {
  return dict[locale] ?? dict.en;
}
