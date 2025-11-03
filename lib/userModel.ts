export interface TransactionModel {
    id: string;
    amount: number;
    date: string;
    type: string;
  }
  
  export interface CouponModel {
    id: string;
    code: string;
    discount: number;
    expiryDate: string;
  }
  
  export interface NotificationsSettings {
    newsUpdates: boolean;
    pointsActivity: boolean;
    promotions: boolean;
    pushNotifications: boolean;
  }
  
  export interface UserModel {
    uid: string;
    name: string;
    email: string;
    phoneNumber: string;
    points: number;
    qrCode: string;
    createdAt: string;
    transactions?: TransactionModel[];
    token?: string;
    notifications?: NotificationsSettings;
    coupons?: CouponModel[];
  }