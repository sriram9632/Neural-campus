import { useEffect, useState } from "react";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "../api";
import { useCollegeDepartment } from "../hooks/useCollegeDepartment";
import CollegeDepartmentSelect from "../components/CollegeDepartmentSelect";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import ErrorAlert from "../components/ui/ErrorAlert";
import RowActions from "../components/ui/RowActions";

const emptyForm = { name: "", age: "", year: "" };

export default function Students() {
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

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadStudents() {
    if (!selectedDepartment) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    try {
      setStudents(await getStudents(selectedDepartment));
    } catch {
      setError("Failed to load students.");
    } finally {
      setLoadingStudents(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, [selectedDepartment]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(student) {
    setEditingId(student._id);
    setForm({
      name: student.name,
      age: String(student.age),
      year: String(student.year),
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
        age: Number(form.age),
        year: Number(form.year),
      };
      if (editingId) {
        await updateStudent(editingId, payload);
      } else {
        await createStudent(payload);
      }
      resetForm();
      await loadStudents();
    } catch {
      setError(editingId ? "Failed to update student." : "Failed to create student.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) return;
    setDeletingId(id);
    try {
      await deleteStudent(id);
      if (editingId === id) resetForm();
      await loadStudents();
    } catch {
      setError("Failed to delete student.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        tag="Student Registry"
        title="Students"
        subtitle="Manage enrolled students by department — name, age, and academic year."
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
              <GlassPanel title={editingId ? "Edit Student" : "Enroll Student"} className="xl:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="input-field"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Age"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      required
                      min="1"
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Year (1–4)"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      required
                      min="1"
                      max="4"
                      className="input-field"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting || !selectedDepartment}
                      className="btn-primary flex-1"
                    >
                      {submitting ? "Saving…" : editingId ? "Update Student" : "Enroll Student"}
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
                <GlassPanel title={`Students (${students.length})`}>
                  {loadingStudents ? (
                    <p className="text-slate-400">Loading…</p>
                  ) : students.length === 0 ? (
                    <p className="text-slate-400">No students in this department.</p>
                  ) : (
                    <>
                      <div className="hidden overflow-x-auto rounded-xl border border-slate-700/50 md:block">
                        <table className="w-full text-left text-sm">
                          <thead className="border-b border-slate-700 bg-slate-950/80 font-mono text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Age</th>
                              <th className="px-4 py-3">Year</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((s) => (
                              <tr key={s._id} className="border-b border-slate-800/80 text-slate-200">
                                <td className="px-4 py-3">{s.name}</td>
                                <td className="px-4 py-3">{s.age}</td>
                                <td className="px-4 py-3">
                                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                                    Year {s.year}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <RowActions
                                    onEdit={() => startEdit(s)}
                                    onDelete={() => handleDelete(s._id)}
                                    deleting={deletingId === s._id}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="space-y-3 md:hidden">
                        {students.map((s) => (
                          <div
                            key={s._id}
                            className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/50 p-4"
                          >
                            <div>
                              <p className="font-medium text-white">{s.name}</p>
                              <p className="text-sm text-slate-400">
                                Age {s.age} · Year {s.year}
                              </p>
                            </div>
                            <RowActions
                              onEdit={() => startEdit(s)}
                              onDelete={() => handleDelete(s._id)}
                              deleting={deletingId === s._id}
                            />
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
