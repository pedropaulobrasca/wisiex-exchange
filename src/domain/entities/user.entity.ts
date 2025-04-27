export interface UserProps {
  id?: string;
  username: string;
  usdBalance: number;
  btcBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id?: string;
  public readonly username: string;
  public usdBalance: number;
  public btcBalance: number;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.usdBalance = props.usdBalance;
    this.btcBalance = props.btcBalance;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  updateBalances(newUsdBalance: number, newBtcBalance: number) {
    this.usdBalance = newUsdBalance;
    this.btcBalance = newBtcBalance;
    this.updatedAt = new Date();
  }
}
