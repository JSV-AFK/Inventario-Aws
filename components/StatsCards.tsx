type Props = {
  total: number;
  totalValue: number;
  lowStockCount: number;
};

export default function StatsCards({ total, totalValue, lowStockCount }: Props) {
  return (
    <section className="grid grid-cols-3 gap-4">
      <div className="rounded border p-4">
        <p className="text-sm text-gray-500">Productos</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="rounded border p-4">
        <p className="text-sm text-gray-500">Valor del inventario</p>
        <p className="text-2xl font-bold">${totalValue.toLocaleString("es-CO")}</p>
      </div>
      <div className="rounded border p-4">
        <p className="text-sm text-gray-500">Con stock bajo</p>
        <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
      </div>
    </section>
  );
}
