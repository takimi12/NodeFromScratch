import { Entity, PrimaryGeneratedColumn, OneToOne, Column } from "typeorm";
import { Cart } from "./cart";

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  GHOST = "ghost",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  externalId!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role!: UserRole;

  @OneToOne(() => Cart, (cart) => cart.id)
  cart!: Cart;
}
