import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import '@/styles/App.css'
import AdminLayout from './components/admin/share/AdminLayout';
import CourseManage from './components/admin/course/CourseManage';
import QuillEditor from './components/admin/course/QuillEditor';

const App = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div style={{ width: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                Home Page
            </div>,
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
                    path: 'course', element: <div>manage course page</div>
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
