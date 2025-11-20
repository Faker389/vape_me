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
  export interface UserCoupon{
    category: string;
    claimedDate: string;       // ISO date string
    description: string;
    expiryDate: string;        // ISO date string
    id: string;
    imageUrl: string;
    isDiscount: boolean;
    isUsed: boolean;
    minimalPrice: number;
    pointsCost: number;
    rewardID: string;
    discountamount?: number
    title: string;
    usedDate: string | null;   // 
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
    coupons?: UserCoupon[];
  }