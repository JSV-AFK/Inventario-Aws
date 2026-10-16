import { Movement } from "@/lib/types";

export default function MovementHistory({ movements }: { movements: Movement[] }) {
  return (
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
  );
}