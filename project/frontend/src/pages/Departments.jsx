import { useState } from "react";
import { createDepartment, deleteDepartment, updateDepartment } from "../api";
import { useCollegeDepartment } from "../hooks/useCollegeDepartment";
import CollegeDepartmentSelect from "../components/CollegeDepartmentSelect";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import ErrorAlert from "../components/ui/ErrorAlert";
import RowActions from "../components/ui/RowActions";

export default function Departments() {
  const {
    colleges,
    departments,
    selectedCollege,
    setSelectedCollege,
    selectedDepartment,
    setSelectedDepartment,
    loading,
    loadingDepts,
    error,
    setError,
    reloadDepartments,
  } = useCollegeDepartment();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function resetForm() {
    setName("");
    setEditingId(null);
  }

  function startEdit(dept) {
    setEditingId(dept._id);
    setName(dept.name);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedCollege) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateDepartment(editingId, { college_id: selectedCollege, name });
      } else {
        await createDepartment({ college_id: selectedCollege, name });
      }
      resetForm();
      await reloadDepartments();
    } catch {
      setError(editingId ? "Failed to update department." : "Failed to create department.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this department?")) return;
    setDeletingId(id);
    try {
      await deleteDepartment(id);
      if (editingId === id) resetForm();
      if (selectedDepartment === id) setSelectedDepartment("");
      await reloadDepartments();
    } catch {
      setError("Failed to delete department.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        tag="Academic Units"
        title="Departments"
        subtitle="Browse and manage departments within each college."
      />
      <ErrorAlert message={error} />

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : colleges.length === 0 ? (
        <GlassPanel>
          <p className="text-slate-400">Add a college first to create departments.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-8">
          <CollegeDepartmentSelect
            colleges={colleges}
            departments={departments}
            selectedCollege={selectedCollege}
            setSelectedCollege={setSelectedCollege}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            loadingDepts={loadingDepts}
          />

          <div className="grid gap-8 xl:grid-cols-5">
            <GlassPanel title={editingId ? "Edit Department" : "Add Department"} className="xl:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Department name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                />
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
                    {submitting ? "Saving…" : editingId ? "Update Department" : "Add Department"}
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
              <GlassPanel title={`Departments (${departments.length})`}>
                {loadingDepts ? (
                  <p className="text-slate-400">Loading…</p>
                ) : departments.length === 0 ? (
                  <p className="text-slate-400">No departments for this college.</p>
                ) : (
                  <>
                    <div className="hidden overflow-x-auto rounded-xl border border-slate-700/50 md:block">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-700 bg-slate-950/80 font-mono text-xs uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departments.map((dept) => (
                            <tr key={dept._id} className="border-b border-slate-800/80 text-slate-200">
                              <td className="px-4 py-3 font-medium text-violet-300">{dept.name}</td>
                              <td className="px-4 py-3">
                                <RowActions
                                  onEdit={() => startEdit(dept)}
                                  onDelete={() => handleDelete(dept._id)}
                                  deleting={deletingId === dept._id}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid gap-3 md:hidden">
                      {departments.map((dept) => (
                        <div
                          key={dept._id}
                          className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/50 p-4"
                        >
                          <h3 className="font-semibold text-violet-300">{dept.name}</h3>
                          <RowActions
                            onEdit={() => startEdit(dept)}
                            onDelete={() => handleDelete(dept._id)}
                            deleting={deletingId === dept._id}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </GlassPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
