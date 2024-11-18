export interface ITask {
  name: string;
  description: string;
  areas: string[];
  currency: string;
  estimated_budget: number;
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
  product_id: string;
  business_id: string;
  comments: [
    {
      user_id: string;
      content: string;
    },
  ];
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
  actual_time: number;
  completed_time: number;
  completed_date: Date;
  assigned_to: string;
  assigned_by: string;
  created_by: string;
  note: string;
  extra_data: string;
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
