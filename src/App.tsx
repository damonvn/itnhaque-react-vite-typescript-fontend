import { useEffect, useState } from 'react'
import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
} from "react-router-dom";
import '@/styles/App.css'
import AdminLayout from './components/admin/layout.admin';
import CourseManage from './components/admin/course/course.manage';

const App = () => {

    const router = createBrowserRouter([
        {
            path: "/admin",
            element: <AdminLayout />,
            errorElement: <div>404 Not Found</div>,
            children: [
                {
                    index: true, element: <div>Admin Layout</div>
                },
                {
                    path: "course",
                    element: <div>manage course page</div>
                },
                {
                    path: "user",
                    element: <div>manage user page</div>
                },
                {
                    path: "role",
                    element: <div>manage role page</div>
                },
            ],
        },
        {
            path: "course-manage",
            element: <CourseManage />,
            errorElement: <div>404 Not Found</div>,
        }
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
