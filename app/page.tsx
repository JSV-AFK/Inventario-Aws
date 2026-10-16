"use client";

import { useState } from "react";
import { mockProducts } from "@/lib/data";

export default function Home() {
  const [query, setQuery] = useState("");

  const products = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Inventario</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre o SKU..."
        className="mb-4 w-full rounded border p-2"
      />

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Producto</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.sku}</td>
              <td className="p-2">${p.price.toLocaleString("es-CO")}</td>
              <td className="p-2">
                {p.stock}{" "}
                {p.stock <= p.minStock && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                    Stock bajo
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}