import Dexie, { type Table } from 'dexie';

export interface Broker {
  id?: number;
  name: string;
  phone: string;
  commissionRate: number; // Percentage
  whatsapp: string;
  sortOrder?: number;
}

export interface Merchant {
  id?: number;
  name: string;
  shopName: string;
  phone: string;
  brokerId: number;
  subscriptionFee: number;
  lastPaymentDate: Date;
  expiryDate: Date;
  latitude?: number;
  longitude?: number;
  locationUrl?: string;
  notes: string;
  status: 'active' | 'expired' | 'pending';
  sortOrder?: number;
  isPinned?: boolean;
}

export class AlAmeedDB extends Dexie {
  brokers!: Table<Broker>;
  merchants!: Table<Merchant>;

  constructor() {
    super('AlAmeedDB');
    this.version(2).stores({
      brokers: '++id, name, phone, sortOrder',
      merchants: '++id, name, shopName, phone, brokerId, lastPaymentDate, expiryDate, sortOrder'
    });
  }
}

export const db = new AlAmeedDB();
