import { useAppSelector } from "@/redux/hooks";
import NotPermitted from "./not-permitted";
import Loading from "../Loading";
import { useEffect, useState } from "react";

const AdminRoleBaseRoute = (props: any) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)
    const userRole = useAppSelector(state => state.account.role);
    const isLoading = useAppSelector(state => state.account.isLoading)
    const [isDelayed, setIsDelayed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelayed(true);  // Set to true after 500ms
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading === true) {
        return <Loading />
    } else {
        if (userRole === 'ADMIN' && isAuthenticated === true) {
            return (<>{props.children}</>)
        } else {
            if (!isDelayed) {
                return null;
            }
            const callback = window.location.pathname;
            return (<NotPermitted callback={callback} />)
        }
    }
}

const ProtectedRoute = (props: any) => {
    return (
        <AdminRoleBaseRoute>
            {props.children}
        </AdminRoleBaseRoute>
    )
}

export default ProtectedRoute;