// import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

// @Entity() //dekorator tworzący tabelę
// export class Product {
//   @PrimaryGeneratedColumn("uuid") // dekorator tworzący kolumnę z kluczem głównym, która jest generowana automatycznie
//   id!: string;
//   @Column({
//     unique: true,
//   }) // dekorator tworzący kolumnę
//   name!: string;
//   @Column({
//     length: 150,
//     default: ''
//   })
//   description!: string;
//   @Column("decimal", { precision: 10, scale: 2 }) // nadaje ograniczenia na ilość liczb przed (precision) i po przecinku (scale)
//   price!: number;
//   @Column({
//     default: 1
//   })
//   stock!: number;
//   @CreateDateColumn() //automatycznie dodaje datę podczas tworzenia
//   createdAt!: Date;
//   @UpdateDateColumn() //automatycznie dodaje datę podczas aktualizacji
//   updatedAt!: Date;
//   @DeleteDateColumn({ type: "timestamptz", nullable: true }) //pozwala obsługiwać soft delete
//   deletedAt?: Date;
// }

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Cart } from "./cart";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  
  @Column({
    unique: true,
  })
  name!: string;
  
  @Column({
    length: 150,
    default: "",
  })
  description!: string;

  
  @Column({ type: "numeric", precision: 10, scale: 2 })
  price!: number;
  
  @Column({
    default: 1,
  })
  stock!: number;
  
  @CreateDateColumn()
  createdAt!: Date;
  
  @UpdateDateColumn()
  updatedAt!: Date;
  
  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt?: Date;
  
  // Poprawiona relacja - dodajemy osobną kolumnę cartId
  @ManyToOne(() => Cart, (cart: Cart) => cart.products, { 
    onDelete: "CASCADE",
    nullable: true // Pozwalamy na null, żeby móc tworzyć produkty bez przypisania do koszyka
  })
  @JoinColumn({ name: "cartId" }) // Tworzy kolumnę cartId jako klucz obcy
  cart!: Cart;
  
  @Column({ nullable: true })
  cartId!: string;
}