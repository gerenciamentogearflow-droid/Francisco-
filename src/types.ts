export interface ServiceItem {
  id: string;
  description: string;
  laborCost: number;
  partsCost: number;
}

export interface ServiceData {
  clientName: string;
  licensePlate: string;
  model: string;
  date: string;
  notes: string;
  items: ServiceItem[];
  images: string[];
  certificateTitle?: string;
}
