
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./product";
import { User } from "./user";

@Entity() //dekorator tworzący tabelę
export class Cart {
  @PrimaryGeneratedColumn("uuid") // dekorator tworzący kolumnę z kluczem głównym, która jest generowana automatycznie
  id!: string;
  // Relacja: Jeden koszyk może zawierać wiele produktów
  @OneToMany(() => Product, (product) => product.cart)
  products!: Product[];

  // Relacja: Jeden koszyk należy do jednego użytkownika
  @OneToOne(() => User, (user) => user.cart, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" }) // Tworzy klucz obcy userId
  user!: User;
}