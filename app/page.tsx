"use client";

import { useState } from "react";
import { mockProducts } from "@/lib/data";
import { Product } from "@/lib/types";

type Movement = {
  id: number;
  productName: string;
  type: "entrada" | "salida";
  quantity: number;
  date: string;
};

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  minStock: "",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const filtered = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())) &&
      (category === "" || p.category === category) &&
      (!onlyLow || p.stock <= p.minStock)
  );

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.sku.trim()) return;

    const data = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
    };

    if (editingId) {
      setProducts(
        products.map((p) => (p.id === editingId ? { ...p, ...data } : p))
      );
    } else {
      setProducts([...products, { id: crypto.randomUUID(), ...data }]);
    }
    cancelEdit();
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      minStock: String(p.minStock),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function moveStock(id: string, type: "entrada" | "salida") {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
    if (type === "salida" && qty > product.stock) {
      alert(`Solo hay ${product.stock} unidades de "${product.name}".`);
      return;
    }

    const delta = type === "entrada" ? qty : -qty;
    setProducts(
      products.map((p) => (p.id === id ? { ...p, stock: p.stock + delta } : p))
    );
    setMovements([
      {
        id: Date.now(),
        productName: product.name,
        type,
        quantity: qty,
        date: new Date().toLocaleString("es-CO"),
      },
      ...movements,
    ]);
  }

  function deleteProduct(p: Product) {
    if (!window.confirm(`¿Borrar "${p.name}"?`)) return;
    setProducts(products.filter((x) => x.id !== p.id));
    if (editingId === p.id) cancelEdit();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Inventario</h1>

      <section className="grid grid-cols-3 gap-4">
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Productos</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Valor del inventario</p>
          <p className="text-2xl font-bold">
            ${totalValue.toLocaleString("es-CO")}
          </p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Con stock bajo</p>
          <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
        </div>
      </section>

      <form
        onSubmit={saveProduct}
        className="grid grid-cols-2 gap-2 rounded border p-4 md:grid-cols-6"
      >
        <p className="col-span-2 font-semibold md:col-span-6">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </p>
        <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded border p-2 md:col-span-2" />
        <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="rounded border p-2" />
        <input placeholder="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded border p-2" />
        <input placeholder="Precio" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded border p-2" />
        <input placeholder="Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="rounded border p-2" />
        <input placeholder="Stock mínimo" type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} className="rounded border p-2" />
        <button type="submit" className="rounded bg-black p-2 text-white md:col-span-2">
          {editingId ? "Guardar cambios" : "Agregar producto"}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} className="rounded border p-2">
            Cancelar
          </button>
        )}
      </form>

      <section className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o SKU..."
          className="min-w-48 flex-1 rounded border p-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border p-2"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={onlyLow}
            onChange={(e) => setOnlyLow(e.target.checked)}
          />
          Solo stock bajo
        </label>
        <label className="flex items-center gap-1 text-sm">
          Cantidad:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-20 rounded border p-2"
          />
        </label>
      </section>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Producto</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Categoría</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No hay productos que coincidan.
              </td>
            </tr>
          )}
          {filtered.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.sku}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">${p.price.toLocaleString("es-CO")}</td>
              <td className="p-2">
                {p.stock}{" "}
                {p.stock <= p.minStock && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                    Stock bajo
                  </span>
                )}
              </td>
              <td className="space-x-1 p-2">
                <button onClick={() => moveStock(p.id, "entrada")} className="rounded border px-2">Entrada</button>
                <button onClick={() => moveStock(p.id, "salida")} className="rounded border px-2">Salida</button>
                <button onClick={() => startEdit(p)} className="rounded border px-2">Editar</button>
                <button onClick={() => deleteProduct(p)} className="rounded border px-2 text-red-600">Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Historial de movimientos</h2>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay movimientos.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {movements.map((m) => (
              <li key={m.id}>
                {m.date} — {m.type === "entrada" ? "Entrada" : "Salida"} de {m.quantity} · {m.productName}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}