export interface TowingRequest {
  id?: number;
  name: string;
  address: string;
  phoneNumber: string;
  requestType: string;
  status: string;
  description: string;
  createdDate?: Date;
  updatedDate?: Date;
}
