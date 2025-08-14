export interface RequestFormData {
  jobDescription: string;
  jobStartDate: string;
  location: string;
  requesterName: string;
  requesterId: string;
  requesterDept: string;
  requesterComment: string;
}

export interface ProviderPerson {
  id: string;
  pNumber: string;
  name: string;
}

export interface ServiceItem {
  id: string;
  subType: string;
  quantity: string;
  providerLocation: string;
  providerHead: string;
  providerPersons: ProviderPerson[];
  vendor: string;
  // Manpower specific fields
  skill?: string;
  subSkill?: string;
  workLocation?: string;
  idDetails?: string;
  activeGatePass?: 'Yes' | 'No';
  skilledPersons?: number;
  unskilledPersons?: number;
}

export interface ServiceSection {
  type: 'scaffolding' | 'rope-access' | 'crane' | 'manpower' | 'scaffolding-team';
  items: ServiceItem[];
}

export interface SubmitRequest {
  formData: RequestFormData;
  services: ServiceSection[];
}