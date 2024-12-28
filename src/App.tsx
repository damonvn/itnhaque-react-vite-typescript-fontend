import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import '@/styles/App.css'
import AdminLayout from './components/admin/AdminLayout';
import CourseManage from './components/admin/course/CourseManage';

import AdminCourse from './components/admin/AdminCourse';
import LoginPage from './components/login/LoginPage';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { fetchAccount } from './redux/slices/accountSlice';
import ProtectedRoute from './components/share/protected/protected-route';
import Test from './pages/test-cookie';

const App = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (
            window.location.pathname === '/login'
        )
            return;
        dispatch(fetchAccount())
    }, [])
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div>Home</div>,
            errorElement: <div>404 Not Found</div>,
        },
        {
            path: '/admin',
            element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
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
            path: '/course-manage',
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
        {
            path: '/refresh',
            element: <Test />,
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
