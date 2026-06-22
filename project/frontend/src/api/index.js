import api from "./client";

export const signUp = (data) =>
  api.post("/auth/signup", data).then((res) => res.data);
export const signIn = (data) =>
  api.post("/auth/login", data).then((res) => res.data);
export const guestLogin = () =>
  api.post("/auth/guest").then((res) => res.data);
export const sendGmailOtp = (email) =>
  api.post("/auth/gmail/send-otp", { email }).then((res) => res.data);
export const verifyGmailOtp = (email, otp) =>
  api.post("/auth/gmail/verify-otp", { email, otp }).then((res) => res.data);
export const getMe = () => api.get("/auth/me").then((res) => res.data);
export const getLoginLogs = () => api.get("/auth/login-logs").then((res) => res.data);

export const getColleges = () => api.get("/colleges").then((res) => res.data);
export const createCollege = (data) =>
  api.post("/college", data).then((res) => res.data);
export const updateCollege = (id, data) =>
  api.put(`/college/${id}`, data).then((res) => res.data);
export const deleteCollege = (id) =>
  api.delete(`/college/${id}`).then((res) => res.data);

export const getDepartments = (collegeId) =>
  api.get(`/departments/${collegeId}`).then((res) => res.data);
export const createDepartment = (data) =>
  api.post("/department", data).then((res) => res.data);
export const updateDepartment = (id, data) =>
  api.put(`/department/${id}`, data).then((res) => res.data);
export const deleteDepartment = (id) =>
  api.delete(`/department/${id}`).then((res) => res.data);

export const getStudents = (departmentId) =>
  api.get(`/students/${departmentId}`).then((res) => res.data);
export const createStudent = (data) =>
  api.post("/student", data).then((res) => res.data);
export const updateStudent = (id, data) =>
  api.put(`/student/${id}`, data).then((res) => res.data);
export const deleteStudent = (id) =>
  api.delete(`/student/${id}`).then((res) => res.data);

export const getCourses = (departmentId) =>
  api.get(`/courses/${departmentId}`).then((res) => res.data);
export const createCourse = (data) =>
  api.post("/course", data).then((res) => res.data);

export const getFaculty = (departmentId) =>
  api.get(`/faculty/${departmentId}`).then((res) => res.data);
export const createFaculty = (data) =>
  api.post("/faculty", data).then((res) => res.data);
export const updateFaculty = (id, data) =>
  api.put(`/faculty/${id}`, data).then((res) => res.data);
export const deleteFaculty = (id) =>
  api.delete(`/faculty/${id}`).then((res) => res.data);

export async function getPortalStats() {
  const colleges = await getColleges();
  let departments = 0;
  let students = 0;
  let courses = 0;
  let faculty = 0;

  for (const college of colleges) {
    const depts = await getDepartments(college._id);
    departments += depts.length;

    for (const dept of depts) {
      const [deptStudents, deptCourses, deptFaculty] = await Promise.all([
        getStudents(dept._id),
        getCourses(dept._id),
        getFaculty(dept._id),
      ]);
      students += deptStudents.length;
      courses += deptCourses.length;
      faculty += deptFaculty.length;
    }
  }

  return { colleges: colleges.length, departments, students, courses, faculty };
}
