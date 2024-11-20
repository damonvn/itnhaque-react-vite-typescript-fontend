import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import '@/styles/App.css'
import AdminLayout from './components/admin/share/AdminLayout';
import CourseManage from './components/admin/course/CourseManage';

import AdminCourse from './components/admin/AdminCourse';

const App = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div>Home</div>,
            errorElement: <div>404 Not Found</div>,
        },
        {
            path: '/admin',
            element: <AdminLayout />,
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
            path: 'course-manage',
            element: <CourseManage />,
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
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
