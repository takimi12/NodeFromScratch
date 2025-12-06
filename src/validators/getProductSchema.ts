// src/schemas/product.schema.ts
import { z } from "zod";

/**
 * Schemat walidacji query params dla paginacji, sortowania i filtrowania produktów
 */
export const getProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),       // numer strony, domyślnie 1
    perPage: z.coerce.number().int().positive().default(10),   // liczba produktów na stronie, domyślnie 10
    sortBy: z.string().default("createdAt"),                  // pole do sortowania
    sortDir: z.enum(["asc", "desc"]).default("asc"),          // kierunek sortowania
    filterBy: z.string().default(""),                         // pole po którym filtrować
    query: z.string().default(""),                            // wartość filtra
  }),
});
