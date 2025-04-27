export type OrderType = 'BUY' | 'SELL';
export type OrderStatus = 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED';

export interface OrderProps {
  id?: string;
  userId: string;
  type: OrderType;
  amount: number;
  price: number;
  status?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  public readonly id?: string;
  public readonly userId: string;
  public readonly type: OrderType;
  public amount: number;
  public price: number;
  public status: OrderStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.type = props.type;
    this.amount = props.amount;
    this.price = props.price;
    this.status = props.status ?? 'OPEN';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  updateAmount(newAmount: number) {
    this.amount = newAmount;
    this.updatedAt = new Date();
  }

  updateStatus(newStatus: OrderStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}
