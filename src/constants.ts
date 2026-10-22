export const CHARACTER_LIMIT = 25000;
export const SOURCE_REPO = 'https://github.com/VoltAgent/awesome-design-md';
export const SOURCE_LICENSE = 'MIT';
export const MOBILE_SOURCE_REPO = 'https://github.com/TrustOtc/awesome-mobile-design-md';
export const IOS_SOURCE_REPO = 'https://github.com/meliwat/awesome-ios-design-md';

/** Source key used on entries authored in-repo for the maintainer's own projects. */
export const ADELPRO_SOURCE = 'adelpro';
export const ADELPRO_SOURCE_REPO = 'https://github.com/adelpro';

export const PLATFORMS = ['web', 'mobile', 'ios', 'shadcn'] as const;
export type Platform = (typeof PLATFORMS)[number];

/** Upstream repo URL for each platform, for source attribution in tool output. */
export const SOURCE_BY_PLATFORM: Record<Platform, string> = {
  web: SOURCE_REPO,
  mobile: MOBILE_SOURCE_REPO,
  ios: IOS_SOURCE_REPO,
  shadcn: 'https://ui.shadcn.com',
};

/** Frameworks a DESIGN.md can ship a paste-ready implementation for. */
export const FLAVORS = ['swiftui', 'expo', 'android'] as const;
export type Flavor = (typeof FLAVORS)[number];

/**
 * Flavours an entry can serve. Declared per entry via `flavors` in the index;
 * iOS entries historically ship all three and keep that default when the field
 * is absent, so no existing slug changes behaviour.
 */
export function availableFlavors(entry: {
  platform?: string;
  flavors?: string[];
}): readonly string[] {
  if (entry.flavors?.length) return entry.flavors;
  return entry.platform === 'ios' ? FLAVORS : [];
}

/** Attribution URL for one entry: authored sources carry their own URL. */
export function sourceUrlFor(entry: { platform?: Platform; source?: string }): string {
  if (entry.source === ADELPRO_SOURCE) return ADELPRO_SOURCE_REPO;
  const platform = (entry.platform ?? 'web') as Platform;
  return SOURCE_BY_PLATFORM[platform];
}
