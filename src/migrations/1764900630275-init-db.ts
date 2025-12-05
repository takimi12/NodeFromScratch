import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "../models/product";  // <-- import modelu Product

export class InitDb1764900630275 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Dodanie bazowych produktów
        await queryRunner.manager.insert(Product, [
            {
                name: "Product 1",
                description: "Opis produktu 1",
                price: 100.15,
                stock: 10,
            },
            {
                name: "Product 2",
                description: "Opis produktu 2",
                price: 200.22,
                stock: 20,
            },
            {
                name: "Product 3",
                description: "Opis produktu 3",
                price: 300.22,
                stock: 30,
            },
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Usuwanie dodanych produktów przy wycofaniu migracji
        await queryRunner.manager.delete(Product, [
            { name: "Product 1" },
            { name: "Product 2" },
            { name: "Product 3" },
        ]);
    }

}
