export default function CollegeDepartmentSelect({
  colleges,
  departments,
  selectedCollege,
  setSelectedCollege,
  selectedDepartment,
  setSelectedDepartment,
  loadingDepts,
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-500">
          College
        </label>
        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          className="input-field min-w-[200px]"
        >
          {colleges.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-500">
          Department
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          disabled={loadingDepts || departments.length === 0}
          className="input-field min-w-[200px] disabled:opacity-50"
        >
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
