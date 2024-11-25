export interface ITask {
  _id?: string;
  name: string;
  description: string;
  code: string;
  type: 'brief' | 'task' | 'project' | 'target';
  status:
    | 'called'
    | 'quote_sent'
    | 'negotiate'
    | 'win'
    | 'not_contacted'
    | 'messaged'
    | 'consider'
    | 'no_response';
  state: 'todo' | 'in_progress' | 'approve' | 'completed' | 'follow' | 'won';
  product_id: string[];
  business_id: string;
  comments: string[];
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
  actual_time: number;
  completed_time: number;
  completed_date: Date;
  assigned_to: any;
  assigned_by: any;
  created_by: any;
  note: string;
  extra_data: string;
  areas: string[];
  currency: string;
  estimated_budget: number;
  type_ad: string[];
  customer_source: string;
  avatar: string;
  reminder: Date;
  updateBy: any;
}

export enum TaskState {
  REQUEST_CUSTOMER = 'requset_customer',
  QUOTE = 'quote',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
  PENDING = 'pending',
  COMPLETED = 'completed',
}
