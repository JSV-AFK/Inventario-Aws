export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
};

export type Movement = {
  id: string; 
  productName: string;
  type: "entrada" | "salida";
  quantity: number;
  date: string;
};