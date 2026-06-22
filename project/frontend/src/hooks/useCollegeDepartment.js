import { useCallback, useEffect, useState } from "react";
import { getColleges, getDepartments } from "../api";

export function useCollegeDepartment() {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [error, setError] = useState("");

  const reloadDepartments = useCallback(async () => {
    if (!selectedCollege) return [];
    setLoadingDepts(true);
    try {
      const data = await getDepartments(selectedCollege);
      setDepartments(data);
      setSelectedDepartment((prev) =>
        data.some((d) => d._id === prev) ? prev : data[0]?._id ?? ""
      );
      return data;
    } catch {
      setError("Failed to load departments.");
      return [];
    } finally {
      setLoadingDepts(false);
    }
  }, [selectedCollege]);

  useEffect(() => {
    getColleges()
      .then((data) => {
        setColleges(data);
        if (data.length > 0) setSelectedCollege(data[0]._id);
      })
      .catch(() => setError("Failed to load colleges. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reloadDepartments();
  }, [reloadDepartments]);

  return {
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
  };
}
