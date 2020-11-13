const IndexPage = () => import("@/components/index/IndexPage");

// admin router
const AdminRouter = () => import("@/components/admin/index/AdminRouter");
const AdminResource = () => import("@/components/admin/resource/ResourceManagement");

// 教学信息管理
const AdminSemester = () => import('@/components/admin/teaching/semester/Semester');
const AdminTimetable = () => import('@/components/admin/teaching/timetable/Timetable');
const AdminSpace = () => import('@/components/admin/teaching/space/Space');
const AdminInstitution = () => import("@/components/admin/teaching/institution/Institution");
const AdminTeacher = () => import('@/components/admin/teaching/teacher/Teacher');
const AdminCourse = () => import("@/components/admin/teaching/course/Course");
const AdminSchedule = () => import("@/components/admin/teaching/schedule/Schedule");

// teacher router

// student router

export const routes = [
  {
    path: "/",
    name: "index",
    component: IndexPage,
  },
  {
    path: "/admin",
    component: AdminRouter,
    children: [
      {
        path: "resource",
        name: "admin_resource",
        component: AdminResource,
      },
      {
        path: "institution",
        name: "admin_institution",
        component: AdminInstitution,
      },
      {
        path: "course",
        name: "admin_course",
        component: AdminCourse,
      },
      {
        path: "schedule",
        name: "admin_schedule",
        component: AdminSchedule,
      },
      {
        path:"space",
        name:"admin_space",
        component: AdminSpace
      },
      {
        path: "teacher",
        name: "admin_teacher",
        component: AdminTeacher
      },
      {
        path: "timetable",
        name: "admin_timetable",
        component: AdminTimetable
      },
      {
        path: "semester",
        name: "admin_semester",
        component: AdminSemester
      }
    ],
  },
];
