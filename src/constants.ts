export const CHARACTER_LIMIT = 25000;
export const SOURCE_REPO = 'https://github.com/VoltAgent/awesome-design-md';
export const SOURCE_LICENSE = 'MIT';
export const MOBILE_SOURCE_REPO = 'https://github.com/TrustOtc/awesome-mobile-design-md';
export const IOS_SOURCE_REPO = 'https://github.com/meliwat/awesome-ios-design-md';

export const PLATFORMS = ['web', 'mobile', 'ios', 'shadcn'] as const;
export type Platform = (typeof PLATFORMS)[number];

/** Upstream repo URL for each platform, for source attribution in tool output. */
export const SOURCE_BY_PLATFORM: Record<Platform, string> = {
  web: SOURCE_REPO,
  mobile: MOBILE_SOURCE_REPO,
  ios: IOS_SOURCE_REPO,
  shadcn: 'https://ui.shadcn.com',
};
