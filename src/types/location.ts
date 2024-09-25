export interface ILocation {
  international: boolean;
  country: string;
  city: string;
  user_id?: string;
  ward?: string;
  district?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  status: number;
  street?: string;
  gps?: string;
}
