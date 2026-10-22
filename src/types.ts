export interface DesignIndexEntry {
  slug: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  word_count: number;
  /** Which collection this design came from. "web" = VoltAgent desktop sites, "mobile" = TrustOtc mobile archetypes, "ios" = Meliwat iOS app systems, "shadcn" = authored shadcn/ui design system. */
  platform?: 'web' | 'mobile' | 'ios' | 'shadcn';
  /**
   * Provenance of the file, orthogonal to `platform`. Absent means it was
   * derived from an upstream MIT collection; 'adelpro' means it was authored
   * in-repo for one of the author's own projects. Platform stays honest about
   * the runtime target, so one design can be 'mobile' and 'adelpro' at once.
   */
  source?: string;
  /**
   * Framework implementations that ship alongside the neutral spec, as
   * flavour suffixes: `mushaf-native.md` plus `mushaf-native-expo.md` declares
   * `flavors: ['expo']`. iOS entries default to all three flavours when this
   * is absent, preserving the historical behaviour.
   */
  flavors?: string[];
}

export interface DesignIndex {
  source: string;
  license: string;
  note: string;
  generated_at: string;
  count: number;
  categories: string[];
  /** One URL per source key (`web` / `mobile` / `ios` / `shadcn`, plus authored sources such as `adelpro`). */
  sources?: Record<string, string>;
  /** Platform values present in the data, derived from the entries. */
  platforms?: string[];
  designs: DesignIndexEntry[];
}
