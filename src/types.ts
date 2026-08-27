export interface DesignIndexEntry {
  slug: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  word_count: number;
  /** Which collection this design came from. "web" = VoltAgent desktop sites, "mobile" = TrustOtc mobile archetypes, "ios" = Meliwat iOS app systems, "shadcn" = authored shadcn/ui design system. */
  platform?: 'web' | 'mobile' | 'ios' | 'shadcn';
}

export interface DesignIndex {
  source: string;
  license: string;
  note: string;
  generated_at: string;
  count: number;
  categories: string[];
  designs: DesignIndexEntry[];
}
