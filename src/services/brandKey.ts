const FLAVOR_SUFFIXES = ['-swiftui', '-expo', '-android'];

/**
 * The brand a slug belongs to, so the same product in two collections
 * (spotify on the web, ios-spotify in the iOS set) collapses to one entry.
 *
 * Deliberately conservative: only the platform prefix and framework flavour
 * suffixes are removed. Nothing else — stripping years or marques would merge
 * `dell-1996` into `dell` and `bmw-m` into `bmw`, which are different designs,
 * and inferring a parent company would merge `astryx` into `meta`.
 */
export function brandKey(slug: string, platform?: string): string {
  let key = slug.trim().toLowerCase();

  if (platform === 'ios' && key.startsWith('ios-')) {
    key = key.slice('ios-'.length);
  }

  for (const suffix of FLAVOR_SUFFIXES) {
    if (key.endsWith(suffix)) {
      key = key.slice(0, -suffix.length);
      break;
    }
  }

  return key;
}
