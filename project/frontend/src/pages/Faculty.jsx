import { useEffect, useState } from "react";
import {
  createFaculty,
  deleteFaculty,
  getFaculty,
  updateFaculty,
} from "../api";
import { useCollegeDepartment } from "../hooks/useCollegeDepartment";
import CollegeDepartmentSelect from "../components/CollegeDepartmentSelect";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import ErrorAlert from "../components/ui/ErrorAlert";
import RowActions from "../components/ui/RowActions";

const emptyForm = { name: "", email: "", designation: "" };

export default function Faculty() {
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
  } = useCollegeDepartment();

  const [faculty, setFaculty] = useState([]);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadFaculty() {
    if (!selectedDepartment) {
      setFaculty([]);
      return;
    }
    setLoadingFaculty(true);
    try {
      setFaculty(await getFaculty(selectedDepartment));
    } catch {
      setError("Failed to load faculty.");
    } finally {
      setLoadingFaculty(false);
    }
  }

  useEffect(() => {
    loadFaculty();
  }, [selectedDepartment]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(member) {
    setEditingId(member._id);
    setForm({
      name: member.name,
      email: member.email,
      designation: member.designation,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDepartment) return;
    setSubmitting(true);
    try {
      const payload = {
        department_id: selectedDepartment,
        name: form.name,
        email: form.email,
        designation: form.designation,
      };
      if (editingId) {
        await updateFaculty(editingId, payload);
      } else {
        await createFaculty(payload);
      }
      resetForm();
      await loadFaculty();
    } catch {
      setError(editingId ? "Failed to update faculty." : "Failed to add faculty member.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this faculty member?")) return;
    setDeletingId(id);
    try {
      await deleteFaculty(id);
      if (editingId === id) resetForm();
      await loadFaculty();
    } catch {
      setError("Failed to delete faculty member.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        tag="Faculty Directory"
        title="Faculty"
        subtitle="Department faculty roster with designations and contact information."
      />
      <ErrorAlert message={error} />

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : colleges.length === 0 ? (
        <GlassPanel>
          <p className="text-slate-400">Add a college and department first.</p>
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

          {departments.length === 0 && !loadingDepts ? (
            <GlassPanel>
              <p className="text-slate-400">No departments for this college.</p>
            </GlassPanel>
          ) : (
            <div className="grid gap-8 xl:grid-cols-5">
              <GlassPanel title={editingId ? "Edit Faculty" : "Add Faculty"} className="xl:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="input-field"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Designation (e.g. Professor)"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    required
                    className="input-field"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting || !selectedDepartment}
                      className="btn-primary flex-1"
                    >
                      {submitting ? "Saving…" : editingId ? "Update Faculty" : "Add Faculty"}
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
                <GlassPanel title={`Faculty (${faculty.length})`}>
                  {loadingFaculty ? (
                    <p className="text-slate-400">Loading…</p>
                  ) : faculty.length === 0 ? (
                    <p className="text-slate-400">No faculty in this department.</p>
                  ) : (
                    <>
                      <div className="hidden overflow-x-auto rounded-xl border border-slate-700/50 md:block">
                        <table className="w-full text-left text-sm">
                          <thead className="border-b border-slate-700 bg-slate-950/80 font-mono text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Designation</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {faculty.map((member) => (
                              <tr key={member._id} className="border-b border-slate-800/80 text-slate-200">
                                <td className="px-4 py-3 font-medium text-white">{member.name}</td>
                                <td className="px-4 py-3 text-rose-400">{member.designation}</td>
                                <td className="px-4 py-3 text-slate-400">{member.email}</td>
                                <td className="px-4 py-3">
                                  <RowActions
                                    onEdit={() => startEdit(member)}
                                    onDelete={() => handleDelete(member._id)}
                                    deleting={deletingId === member._id}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="grid gap-4 md:hidden">
                        {faculty.map((member) => (
                          <div
                            key={member._id}
                            className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-mono text-xs uppercase tracking-wider text-rose-400/80">
                                  {member.designation}
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-white">{member.name}</h3>
                                <p className="mt-2 text-sm text-slate-400">{member.email}</p>
                              </div>
                              <RowActions
                                onEdit={() => startEdit(member)}
                                onDelete={() => handleDelete(member._id)}
                                deleting={deletingId === member._id}
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
          )}
        </div>
      )}
    </div>
  );
}
