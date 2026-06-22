import { Pencil, Trash2 } from "lucide-react";

export default function RowActions({ onEdit, onDelete, deleting }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-cyan-400 transition hover:bg-cyan-500/20"
        title="Edit"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
