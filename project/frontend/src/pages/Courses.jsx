import { useEffect, useState } from "react";
import { createCourse, getCourses } from "../api";
import { useCollegeDepartment } from "../hooks/useCollegeDepartment";
import CollegeDepartmentSelect from "../components/CollegeDepartmentSelect";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import ErrorAlert from "../components/ui/ErrorAlert";

export default function Courses() {
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

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", credits: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedDepartment) {
      setCourses([]);
      return;
    }
    setLoadingCourses(true);
    getCourses(selectedDepartment)
      .then(setCourses)
      .catch(() => setError("Failed to load courses."))
      .finally(() => setLoadingCourses(false));
  }, [selectedDepartment, setError]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDepartment) return;
    setSubmitting(true);
    try {
      await createCourse({
        department_id: selectedDepartment,
        name: form.name,
        code: form.code,
        credits: Number(form.credits),
      });
      setForm({ name: "", code: "", credits: "" });
      setCourses(await getCourses(selectedDepartment));
    } catch {
      setError("Failed to create course.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        tag="Course Catalog"
        title="Courses"
        subtitle="Browse and add courses with codes and credit units per department."
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
            <div className="grid gap-8 lg:grid-cols-5">
              <GlassPanel title="Add Course" className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Course name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Course code (e.g. CS101)"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    required
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Credits"
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: e.target.value })}
                    required
                    min="1"
                    max="10"
                    className="input-field"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !selectedDepartment}
                    className="btn-primary w-full"
                  >
                    {submitting ? "Adding…" : "Add Course"}
                  </button>
                </form>
              </GlassPanel>

              <div className="lg:col-span-3">
                <GlassPanel title={`Courses (${courses.length})`}>
                  {loadingCourses ? (
                    <p className="text-slate-400">Loading…</p>
                  ) : courses.length === 0 ? (
                    <p className="text-slate-400">No courses in this department.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {courses.map((course) => (
                        <div
                          key={course._id}
                          className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-4"
                        >
                          <p className="font-mono text-xs text-amber-400">{course.code}</p>
                          <h3 className="mt-1 font-semibold text-white">{course.name}</h3>
                          <p className="mt-2 text-sm text-slate-400">
                            {course.credits} credit{course.credits !== 1 ? "s" : ""}
                          </p>
                        </div>
                      ))}
                    </div>
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
