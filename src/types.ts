export interface Guest {
  id?: string;
  name: string;
  title?: string;
  phone?: string;
  slug: string;
  waSent?: boolean | number;
  createdAt: number;
}

export interface EventSettings {
  logoUrl: string;
  bannerUrl: string;
  eventName: string;
  theme: string;
  dates: string;
  location: string;
  locationUrl: string;
  galleryImages?: string[];
  heroLogoUrl?: string;
  musicUrl?: string;
}
