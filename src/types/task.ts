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
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  estimated_time: string;
  actual_time: string;
  completed_time: string;
  completed_date: string;
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
  reminder: string;
  updateBy: any;
  createdAt: string;
  updatedAt: string;
  approved_by: any;
  approved_status: string;
  parentTask: ITask;
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
