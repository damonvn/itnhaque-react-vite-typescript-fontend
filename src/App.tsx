import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import '@/styles/App.css'
import CourseManage from '@/pages/admin/course-manage-page';
import AdminCourse from '@/components/admin/course/AdminCourse';
import LoginPage from './pages/login/LoginPage';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { fetchAccount } from './redux/slices/accountSlice';
import ProtectedRoute from './components/share/protected/protected-route';
import AdminPage from '@/pages/admin/AdminPage';
import CourseLectures from './pages/client/course-lectures/course-lectures';
import HomePage from './pages/client/home/home';
import '@/styles/responsive.scss'
import UserTable from './components/admin/user/UserTable';
import RoleTable from './components/admin/role/RoleTable';
import CategoryTable from './components/admin/course.category/CategoryTable';
import SkillTable from './components/admin/course.skill/SkillTable';

const App = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (window.location.pathname === '/login') {
            return;
        } else {
            dispatch(fetchAccount())
        }
    }, [])
    const router = createBrowserRouter([
        {
            path: '/',
            element: <HomePage />,
            errorElement: <div>404 Not Found</div>,
            children: [
                {
                    path: "/course", element: <></>
                }
            ]
        },
        {
            path: '/khoa-hoc',
            element: <CourseLectures />,
            errorElement: <div>404 Not Found</div>,
            children: [
                {
                    path: ":slug/bai-hoc/:id", element: <CourseLectures />
                },
            ],
        },
        {
            path: '/admin',
            element: <ProtectedRoute><AdminPage /></ProtectedRoute>,
            errorElement: <div>404 Not Found</div>,
            children: [
                {
                    index: true, element: <AdminCourse />
                },
                {
                    path: 'course', element: <AdminCourse />
                },
                {
                    path: 'user', element: <UserTable />
                },
                {
                    path: 'role', element: <RoleTable />
                },
                {
                    path: 'category', element: <CategoryTable />
                },
                {
                    path: 'skill', element: <SkillTable />
                },
            ],
        },
        {
            path: '/admin-course-manage',
            element: <ProtectedRoute><CourseManage /></ProtectedRoute>,
            errorElement: <div>404 Not Found</div>,
            children: [
                {
                    index: true, element: <CourseManage />
                },
                {
                    path: "lesson/:id", element: <CourseManage />
                },
                {
                    path: "lesson/edit/:id", element: <CourseManage />
                },
                {
                    path: "chapter/lesson/:id", element: <CourseManage />
                },

            ],
        },
        {
            path: '/login',
            element: <LoginPage />,
            errorElement: <div>404 Not Found</div>,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
