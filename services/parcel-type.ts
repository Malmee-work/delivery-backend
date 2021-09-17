export type ParcelType = {
  id?: number;
  senderId?: number;
  pickupAddress: string;
  dropoffAddress: string;
  status?: ParcelStatus;
  bikerId?: number;
  pickupTime?: string;
  dropoffTime?: string;
};

export type ParcelStatus =
  | 'AVAILABLE'
  | 'TAKEN'
  | 'TAKEN_BY_YOU'
  | 'TO_BE_DELIVERED'
  | 'DELIVERING'
  | 'DELIVERED';
