/**
 * Site-wide configuration, feature flags, and the shipped-titles proof shelf.
 *
 * Anything not yet known is a `TODO:` sentinel rather than a plausible-looking
 * placeholder. `npm run check:todos` lists every one of them, and components
 * refuse to render a link or a claim whose value is still a TODO. See
 * docs/proof-assets.md — an unsourced claim or a dead link on the proof shelf
 * costs more than a missing one.
 */

export type Todo = `TODO:${string}`;

export const isTodo = (value: string): value is Todo => value.startsWith('TODO:');

/** Resolve a value for rendering, or `null` if it is still unresolved. */
export const resolved = (value: string): string | null => (isTodo(value) ? null : value);

export const FEATURES = {
  /**
   * MAN_HUNT's App Store listing 404s (the Apple developer subscription lapsed).
   * The title stays in the codebase in case the subscription is reactivated, but
   * it must render NOWHERE while this is false. See docs/proof-assets.md.
   */
  MAN_HUNT: false,

  /** Flips on the day there is a real client result. Until then §7 stays empty. */
  CASE_STUDIES: false,
} as const;

export const SITE = {
  name: 'Inorganic Games',
  domain: 'inorganicgames.com',
  email: 'support@inorganicgames.com',

  /** Shared by every lead form (ContactForm.astro). Formspree/Basin/etc, or wire to your CRM. */
  formEndpoint: 'TODO:form-endpoint — Formspree/Basin/etc, or wire to your CRM' as string,

  /** Answers the freelancer-flakiness objection. Must be a promise we keep. */
  responseTime: 'TODO:response-time — e.g. "within 24 hours"' as string,

  /** docs/homepage.md §5: "State a turnaround number we can actually hit." */
  turnaround: 'TODO:turnaround — e.g. "10 business days"' as string,
} as const;

/**
 * Secure Fields for Jira — live on the Atlassian Marketplace since 2026.
 *
 * `marketplaceUrl` is the canonical listing; `marketplaceName` is the exact
 * published product name and must match the listing character for character
 * (the Marketplace name is "Secure Fields for Jira", NOT the descriptive H1 used
 * on /secure-fields/). Pricing mirrors the live tier ladder: the 1-10 user tier
 * is free and every tier above is priced at $1 per user per month, with annual
 * billed at 10x monthly.
 */
export const SECURE_FIELDS = {
  marketplaceName: 'Secure Fields for Jira',
  marketplaceUrl: 'https://marketplace.atlassian.com/apps/3178522457/secure-fields-for-jira',
  pricingUrl: 'https://marketplace.atlassian.com/apps/3178522457/secure-fields-for-jira?tab=pricing',
  freeUserTier: 10,
} as const;

export type ShippedTitle = {
  name: string;
  platform: string;
  /** Public, working link. Never render a title whose URL is unresolved. */
  url: string;
  /** Why this title matters to a UA buyer — not what the game is about. */
  pitch: string;
  /** TikTok Minis lead the strip. See docs/proof-assets.md. */
  lead?: boolean;
  /** Gated titles are filtered out before render. */
  flag?: keyof typeof FEATURES;
};

const ALL_TITLES: ShippedTitle[] = [
  {
    name: 'Poly Drop',
    platform: 'TikTok Mini Game',
    url: 'TODO:poly-drop-url — canonical TikTok link',
    pitch:
      'HTML5, instant-load, in-feed, under a hard weight budget. The same engineering problem as a playable ad.',
    lead: true,
  },
  {
    name: 'Poly Defense',
    platform: 'TikTok Mini Game',
    url: 'TODO:poly-defense-url — canonical TikTok link',
    pitch:
      'Boots in a browser inside a social feed, no install step. We have already solved this problem twice.',
    lead: true,
  },
  {
    name: 'Purrfect Alchemy',
    platform: 'Steam',
    url: 'TODO:purrfect-alchemy-url — Steam store page',
    pitch:
      'A commercial casual/merge title in the genre we sell into. Proof we understand retention and onboarding.',
  },
  {
    name: 'WRITHE',
    platform: 'itch.io',
    url: 'TODO:writhe-url — itch.io page',
    pitch: 'A shipped commercial title. Craft behind the hook and the tutorial loop.',
  },
  {
    // Present in code, rendered nowhere. Do not remove; do not un-gate without
    // first confirming the App Store listing resolves. See docs/proof-assets.md.
    name: 'MAN_HUNT',
    platform: 'iOS',
    url: 'TODO:man-hunt-url — listing currently 404s',
    pitch: 'Gated. The App Store listing is dead.',
    flag: 'MAN_HUNT',
  },
];

/** The only list a page may render. Gated titles never reach a template. */
export const SHIPPED_TITLES: ShippedTitle[] = ALL_TITLES.filter(
  (title) => !title.flag || FEATURES[title.flag],
);

/**
 * The honest count, per docs/proof-assets.md: four shipped titles across Steam,
 * itch.io and TikTok. Derived, so it cannot drift out of sync with the gate.
 */
export const SHIPPED_TITLE_COUNT = SHIPPED_TITLES.length;
