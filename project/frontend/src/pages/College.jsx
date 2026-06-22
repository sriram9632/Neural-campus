import { useEffect, useState } from "react";
import {
  createCollege,
  deleteCollege,
  getColleges,
  updateCollege,
} from "../api";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import ErrorAlert from "../components/ui/ErrorAlert";
import RowActions from "../components/ui/RowActions";

export default function College() {
  const [colleges, setColleges] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function loadColleges() {
    try {
      setError("");
      setColleges(await getColleges());
    } catch {
      setError("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadColleges();
  }, []);

  function resetForm() {
    setName("");
    setLocation("");
    setEditingId(null);
  }

  function startEdit(college) {
    setEditingId(college._id);
    setName(college.name);
    setLocation(college.location);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCollege(editingId, { name, location });
      } else {
        await createCollege({ name, location });
      }
      resetForm();
      await loadColleges();
    } catch {
      setError(editingId ? "Failed to update college." : "Failed to create college.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this college?")) return;
    setDeletingId(id);
    try {
      await deleteCollege(id);
      if (editingId === id) resetForm();
      await loadColleges();
    } catch {
      setError("Failed to delete college.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        tag="Campus Network"
        title="Colleges"
        subtitle="Register and explore affiliated colleges in the Neural Campus system."
      />
      <ErrorAlert message={error} />

      <div className="grid gap-8 xl:grid-cols-5">
        <GlassPanel title={editingId ? "Edit College" : "Add College"} className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="College name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="input-field"
            />
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? "Saving…" : editingId ? "Update College" : "Register College"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </GlassPanel>

        <div className="xl:col-span-3">
          <GlassPanel title={`All Colleges (${colleges.length})`}>
            {loading ? (
              <p className="text-slate-400">Loading…</p>
            ) : colleges.length === 0 ? (
              <p className="text-slate-400">No colleges registered yet.</p>
            ) : (
              <>
                <div className="hidden overflow-x-auto rounded-xl border border-slate-700/50 md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-700 bg-slate-950/80 font-mono text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {colleges.map((college) => (
                        <tr key={college._id} className="border-b border-slate-800/80 text-slate-200">
                          <td className="px-4 py-3 font-medium text-cyan-300">{college.name}</td>
                          <td className="px-4 py-3">{college.location}</td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => startEdit(college)}
                              onDelete={() => handleDelete(college._id)}
                              deleting={deletingId === college._id}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid gap-4 md:hidden">
                  {colleges.map((college) => (
                    <div
                      key={college._id}
                      className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-cyan-300">{college.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">{college.location}</p>
                        </div>
                        <RowActions
                          onEdit={() => startEdit(college)}
                          onDelete={() => handleDelete(college._id)}
                          deleting={deletingId === college._id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
