export class CreateSaleDto {
  seller: string;
  items: {
    product: string;
    quantity: number;
    pricePerUnit: number;
  }[];
  location?: string;
}
