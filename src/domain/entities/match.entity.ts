export interface MatchProps {
  id?: string;
  buyerId: string;
  sellerId: string;
  price: number;
  volume: number;
  createdAt?: Date;
}

export class Match {
  public readonly id?: string;
  public readonly buyerId: string;
  public readonly sellerId: string;
  public readonly price: number;
  public readonly volume: number;
  public readonly createdAt: Date;

  constructor(props: MatchProps) {
    this.id = props.id;
    this.buyerId = props.buyerId;
    this.sellerId = props.sellerId;
    this.price = props.price;
    this.volume = props.volume;
    this.createdAt = props.createdAt ?? new Date();
  }
}
