export type LocationCategory =
  | "park"
  | "museum"
  | "winery"
  | "gallery"
  | "restaurant"
  | "landmark"
  | "other";

export type WeatherExposure = "outdoor" | "indoor" | "mixed";

export type WeatherMode = "clear" | "rainy";

export interface Location {
  id: string;
  slug: string;
  name_ro: string;
  name_en: string;
  description_en: string;
  lat: number;
  lng: number;
  category: LocationCategory;
  weather_exposure: WeatherExposure;
  is_free_tier: boolean;
  video_path: string;
  thumb_path: string | null;
  zone_key: string;
  sort_order: number;
  taxi_fare_min: number;
  taxi_fare_max: number;
  is_active: boolean;
}

export interface CulinaryItem {
  id: string;
  location_id: string;
  dish_name_ro: string;
  dish_name_en: string;
  order_this: string;
  avoid_this: string;
  audio_path: string;
  sort_order: number;
}

export interface User {
  id: string;
  visitor_id: string;
  stripe_customer_id: string | null;
  pass_purchased_at: string | null;
  pass_expires_at: string | null;
}

export interface LocationWithAccess extends Location {
  locked: boolean;
}
