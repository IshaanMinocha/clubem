// User and Authentication Types
export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Platform Types
export interface Platform {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  lastUpdated: string;
}

// Upload Types
export type UploadStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Upload {
  id: string;
  fileName: string;
  platform: string;
  uploadedBy: string;
  uploadedAt: string;
  status: UploadStatus;
}

// Order Types
export type OrderStatus = 
  | 'processing' 
  | 'needs_review' 
  | 'ready_to_send' 
  | 'sent' 
  | 'failed';

export type ProcessingStep = 
  | 'ocr' 
  | 'extraction' 
  | 'formatting' 
  | 'email';

export interface GuestItem {
  id: string;
  guestName: string;
  itemName: string;
  modifications: string;
  comments: string;
}

export interface Order {
  id: string;
  businessClient: string;
  clientName: string;
  groupOrderNumber: string;
  requestedDate: string;
  numberOfGuests: number;
  deliveryMode: 'pickup' | 'delivery';
  status: OrderStatus;
  currentStep: ProcessingStep;
  orderSubtotal: number;
  clientInfo: string;
  pickupTime: string;
  items: GuestItem[];
  uploadedBy: string;
  createdAt: string;
}

// Stats Types
export interface DashboardStats {
  totalUploads: number;
  ordersProcessedToday: number;
  failedOrders: number;
  pendingReview: number;
}

// Field Configuration Types
export interface FieldConfig {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  description: string;
}

// Process Configuration Types
export interface ProcessConfig {
  id: string;
  name: string;
  description: string;
  steps: string[];
  isActive: boolean;
}

