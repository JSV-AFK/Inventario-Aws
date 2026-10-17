"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Movement, Product } from "@/lib/types";
import StatsCards from "@/components/StatsCards";
import ProductForm, { emptyForm, FormData } from "@/components/ProductForm";
import Filters from "@/components/Filters";
import ProductTable from "@/components/ProductTable";
import MovementHistory from "@/components/MovementHistory";

type DbProduct = Schema["Product"]["type"];
type DbMovement = Schema["StockMovement"]["type"];

function toProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category ?? "",
    price: p.price,
    stock: p.stock,
    minStock: p.minStock,
  };
}

function toMovement(m: DbMovement): Movement {
  return {
    id: m.id,
    productName: m.productName,
    type: m.type === "salida" ? "salida" : "entrada",
    quantity: m.quantity,
    date: new Date(m.createdAt).toLocaleString("es-CO"),
  };
}

export default function Inventory({ onSignOut }: { onSignOut?: () => void }) {
  const [client] = useState(() => generateClient<Schema>());
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [prods, movs] = await Promise.all([
          client.models.Product.list(),
          client.models.StockMovement.list(),
        ]);
        setProducts(prods.data.map(toProduct));
        const sorted = [...movs.data].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        );
        setMovements(sorted.map(toMovement));
      } catch (err) {
        fail(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [client]);

  function fail(err: unknown) {
    setError(err instanceof Error ? err.message : "Ocurrió un error");
  }

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

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.sku.trim()) return;
    setError("");

    const data = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
    };

    try {
      if (editingId) {
        const res = await client.models.Product.update({ id: editingId, ...data });
        if (!res.data) throw new Error(res.errors?.[0]?.message ?? "No se pudo actualizar");
        const updated = toProduct(res.data);
        setProducts(products.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const res = await client.models.Product.create(data);
        if (!res.data) throw new Error(res.errors?.[0]?.message ?? "No se pudo crear");
        setProducts([...products, toProduct(res.data)]);
      }
      cancelEdit();
    } catch (err) {
      fail(err);
    }
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

  async function moveStock(id: string, type: "entrada" | "salida") {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
    if (type === "salida" && qty > product.stock) {
      alert(`Solo hay ${product.stock} unidades de "${product.name}".`);
      return;
    }

    setError("");
    const newStock = product.stock + (type === "entrada" ? qty : -qty);

    try {
      const upd = await client.models.Product.update({ id, stock: newStock });
      if (!upd.data) throw new Error(upd.errors?.[0]?.message ?? "No se pudo actualizar el stock");
      const updated = toProduct(upd.data);

      const mov = await client.models.StockMovement.create({
        productName: product.name,
        type,
        quantity: qty,
      });

      setProducts(products.map((p) => (p.id === id ? updated : p)));
      if (mov.data) setMovements([toMovement(mov.data), ...movements]);
    } catch (err) {
      fail(err);
    }
  }

  async function deleteProduct(p: Product) {
    if (!window.confirm(`¿Borrar "${p.name}"?`)) return;
    setError("");
    try {
      await client.models.Product.delete({ id: p.id });
      setProducts(products.filter((x) => x.id !== p.id));
      if (editingId === p.id) cancelEdit();
    } catch (err) {
      fail(err);
    }
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <button onClick={onSignOut} className="rounded border px-3 py-1">
          Cerrar sesión
        </button>
      </div>

      {error && (
        <p className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando inventario...</p>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}