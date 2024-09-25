import { ILocation } from './location';

export interface IProduct {
  _id?: string;
  user_id?: string;
  product_code: string;
  product_name: string;
  type: string;
  areas: any;
  status: number;
  images: any[];
  cost: number;
  traffic: any;
  production_cost: string;
  provider: any;
  booking_duration: string;
  currency: string;
  attributes: IAttributes & any;
  location?: ILocation & any;
  description: string;
}

export interface IAttributes {
  width: number;
  height: number;
  video_duration: number;
  pixel_width: number;
  pixel_height: number;
  opera_time_from: string;
  opera_time_to: string;
  frequency: string;
  shape: string;
  note: string;
  add_side: number;
}
