"use client";

import { useState } from "react";
import { mockProducts } from "@/lib/data";
import { Movement, Product } from "@/lib/types";
import StatsCards from "@/components/StatsCards";
import ProductForm, { emptyForm, FormData } from "@/components/ProductForm";
import Filters from "@/components/Filters";
import ProductTable from "@/components/ProductTable";
import MovementHistory from "@/components/MovementHistory";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [form, setForm] = useState<FormData>(emptyForm);
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
      setProducts(products.map((p) => (p.id === editingId ? { ...p, ...data } : p)));
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
    setProducts(products.map((p) => (p.id === id ? { ...p, stock: p.stock + delta } : p)));
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
      <StatsCards total={products.length} totalValue={totalValue} lowStockCount={lowStockCount} />
      <ProductForm
        form={form}
        editing={editingId !== null}
        onChange={setForm}
        onSubmit={saveProduct}
        onCancel={cancelEdit}
      />
      <Filters
        query={query}
        category={category}
        onlyLow={onlyLow}
        quantity={quantity}
        categories={categories}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onOnlyLowChange={setOnlyLow}
        onQuantityChange={setQuantity}
      />
      <ProductTable
        products={filtered}
        onMove={moveStock}
        onEdit={startEdit}
        onDelete={deleteProduct}
      />
      <MovementHistory movements={movements} />
    </main>
  );
}