export interface IBill {
  business_id: string; // Reference to the Business model (customer)
  product_id: string; // Reference to the Product (billboard)
  billing_type: string; // Flat Rate, CPM, CPA
  amount: number; // The amount charged
  currency: string; // Currency used for billing
  payment_status: string; // Pending, Paid, Failed
  start_date: Date; // Start date of the ad campaign
  end_date: Date; // End date of the ad campaign
  duration_in_days: number; // Duration in days
  impressions?: number; // Estimated impressions for CPM
  additional_features?: {
    night_visibility: boolean; // Does the billboard have night-time visibility?
    lighting: boolean; // Extra lighting for the billboard
    digital_screen: boolean; // Is it a digital billboard?
    shape: string; // Shape of the billboard (e.g., rectangular, irregular)
  };
  traffic_estimate?: number; // Traffic data, e.g., estimated people passing by daily
  description?: string; // Additional description or notes
}
