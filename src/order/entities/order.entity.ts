import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  // id productId email status
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  email: string;
  @Column()
  status: string;
}
