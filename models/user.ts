
import { Entity, PrimaryGeneratedColumn, OneToOne, Column } from "typeorm";
import { Cart } from "./cart";

//tworzenie typu enum

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  GHOST = "ghost",
}


@Entity() //dekorator tworzący tabelę
export class User {
  @PrimaryGeneratedColumn("uuid") // dekorator tworzący kolumnę z kluczem głównym, która jest generowana automatycznie
  id!: string;
  @Column({ unique: true })
  externalId!: string;
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role!: UserRole;
  @OneToOne(() => Cart, (cart) => cart.user) // ← TU JEST FIX
  cart!: Cart; //jeden user ma jeden koszyk, powiązanie po ID
}



