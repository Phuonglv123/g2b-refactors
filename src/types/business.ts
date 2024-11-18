export interface IBusiness {
  _id?: string;
  name: string;
  industry: string;
  website: string;
  response: string;
  hotline: string;
  email: string;
  group: string;
  source: string;
  estimated_budget: string;
  note: string;
  status: number; // 0: inactive, 1: active
}
