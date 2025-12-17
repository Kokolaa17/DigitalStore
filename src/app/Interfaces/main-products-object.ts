import { Products } from "./products";

export interface MainProductsObject {
    total: number;
    limit: number;
    page: number;
    skip: number;
    products: Products[],
}
