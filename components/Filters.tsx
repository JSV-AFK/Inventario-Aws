type Props = {
  query: string;
  category: string;
  onlyLow: boolean;
  quantity: string;
  categories: string[];
  onQueryChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onOnlyLowChange: (v: boolean) => void;
  onQuantityChange: (v: string) => void;
};

export default function Filters({
  query, category, onlyLow, quantity, categories,
  onQueryChange, onCategoryChange, onOnlyLowChange, onQuantityChange,
}: Props) {
  return (
    <section className="flex flex-wrap items-center gap-3">
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Buscar por nombre o SKU..."
        className="min-w-48 flex-1 rounded border p-2"
      />
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="rounded border p-2">
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label className="flex items-center gap-1 text-sm">
        <input type="checkbox" checked={onlyLow} onChange={(e) => onOnlyLowChange(e.target.checked)} />
        Solo stock bajo
      </label>
      <label className="flex items-center gap-1 text-sm">
        Cantidad:
        <input type="number" min="1" value={quantity} onChange={(e) => onQuantityChange(e.target.value)} className="w-20 rounded border p-2" />
      </label>
    </section>
  );
}