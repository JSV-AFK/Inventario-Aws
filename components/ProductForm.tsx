export type FormData = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  minStock: string;
};

export const emptyForm: FormData = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  minStock: "",
};

type Props = {
  form: FormData;
  editing: boolean;
  onChange: (form: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function ProductForm({ form, editing, onChange, onSubmit, onCancel }: Props) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-2 rounded border p-4 md:grid-cols-6">
      <p className="col-span-2 font-semibold md:col-span-6">
        {editing ? "Editar producto" : "Nuevo producto"}
      </p>
      <input placeholder="Nombre" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className="rounded border p-2 md:col-span-2" />
      <input placeholder="SKU" value={form.sku} onChange={(e) => onChange({ ...form, sku: e.target.value })} className="rounded border p-2" />
      <input placeholder="Categoría" value={form.category} onChange={(e) => onChange({ ...form, category: e.target.value })} className="rounded border p-2" />
      <input placeholder="Precio" type="number" min="0" value={form.price} onChange={(e) => onChange({ ...form, price: e.target.value })} className="rounded border p-2" />
      <input placeholder="Stock" type="number" min="0" value={form.stock} onChange={(e) => onChange({ ...form, stock: e.target.value })} className="rounded border p-2" />
      <input placeholder="Stock mínimo" type="number" min="0" value={form.minStock} onChange={(e) => onChange({ ...form, minStock: e.target.value })} className="rounded border p-2" />
      <button type="submit" className="rounded bg-black p-2 text-white md:col-span-2">
        {editing ? "Guardar cambios" : "Agregar producto"}
      </button>
      {editing && (
        <button type="button" onClick={onCancel} className="rounded border p-2">
          Cancelar
        </button>
      )}
    </form>
  );
}