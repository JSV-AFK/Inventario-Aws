import { Product } from "@/lib/types";

type Props = {
  products: Product[];
  onMove: (id: string, type: "entrada" | "salida") => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

export default function ProductTable({ products, onMove, onEdit, onDelete }: Props) {
  return (
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
        {products.length === 0 && (
          <tr>
            <td colSpan={6} className="p-4 text-center text-gray-500">
              No hay productos que coincidan.
            </td>
          </tr>
        )}
        {products.map((p) => (
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
              <button onClick={() => onMove(p.id, "entrada")} className="rounded border px-2">Entrada</button>
              <button onClick={() => onMove(p.id, "salida")} className="rounded border px-2">Salida</button>
              <button onClick={() => onEdit(p)} className="rounded border px-2">Editar</button>
              <button onClick={() => onDelete(p)} className="rounded border px-2 text-red-600">Borrar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}