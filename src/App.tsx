import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import '@/styles/App.css'
import CourseManage from '@/pages/admin/course-manage-page';
import AdminCourse from './components/admin/AdminCourse';
import LoginPage from './pages/login/LoginPage';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { fetchAccount } from './redux/slices/accountSlice';
import ProtectedRoute from './components/share/protected/protected-route';
import AdminPage from '@/pages/admin/AdminPage';
import CourseLectures from './pages/client/course-lectures/course-lectures';
import HomePage from './pages/client/home/home';
import '@/styles/responsive.scss'

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
                    path: "/course", element: <HomePage />
                }
            ]
        },
        {
            path: '/course',
            element: <CourseLectures />,
            errorElement: <div>404 Not Found</div>,
            children: [
                {
                    path: "lesson/:id", element: <CourseLectures />
                },
                {
                    path: "lesson/edit/:id", element: <CourseLectures />
                },
                {
                    path: "chapter/lesson/:id", element: <CourseLectures />
                },

            ],
        },
        {
            path: '/admin',
            element: <ProtectedRoute><AdminPage /></ProtectedRoute>,
            errorElement: <div>404 Not Found</div>,
            children: [
                {
                    index: true, element: <div>Admin Layout</div>
                },
                {
                    path: 'course', element: <AdminCourse />
                },
                {
                    path: 'user', element: <div>manage user page</div>
                },
                {
                    path: 'role', element: <div>manage role page</div>
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
