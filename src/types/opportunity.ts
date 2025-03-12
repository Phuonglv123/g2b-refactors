export interface IOpportunity {
  respone: {
    title: string;
    name: string;
    department: string;
    phone: string;
    email: string;
    address: string;
  };
  company: {
    bankAccount: string;
    bankName: string;
    type: string;
    field: string;
    scale: string;
    major: string;
    taxCode: string;
  };
  address: {
    city: string;
    district: string;
    ward: string;
    street: string;
    address: string;
  };
  description: string;
  status: string;
  state: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}


export interface IOpportunityPayload{
    title: string;
    name: string;
    department: string;
    phone: string;
    email: string;
    address: string;
    bankAccount: string;
    bankName: string;
    type: string;
    field: string;
    scale: string;
    major: string;
    taxCode: string;
    city: string;
    district: string;
    ward: string;
    street: string;
    description: string;
    status: string;
}