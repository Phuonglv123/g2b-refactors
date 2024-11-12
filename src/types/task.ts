export interface ITask {
  title: string;
  description: string;
  status: number; // 0: inactive, 1: active
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
