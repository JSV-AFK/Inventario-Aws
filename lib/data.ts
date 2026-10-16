import { Product } from "./types";

export const mockProducts: Product[] = [
  { id: "1", name: "Teclado mecánico", sku: "TEC-001", category: "Periféricos", price: 180000, stock: 12, minStock: 5 },
  { id: "2", name: "Mouse inalámbrico", sku: "MOU-002", category: "Periféricos", price: 75000, stock: 3, minStock: 5 },
  { id: "3", name: "Monitor 24 pulgadas", sku: "MON-003", category: "Pantallas", price: 650000, stock: 8, minStock: 3 },
  { id: "4", name: "Cable HDMI 2m", sku: "CAB-004", category: "Accesorios", price: 25000, stock: 0, minStock: 10 },
];