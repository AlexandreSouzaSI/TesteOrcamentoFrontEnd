import { Header } from "@/components/header";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/sign-in', { replace: true });
            return;
        }

        const interceptorId = api.interceptors.response.use(
            response => response,
            error => {
                if (isAxiosError(error)) {
                    const status = error.response?.status;
                    const code = error.response?.data?.code;

                    if (status === 401 && code === "Credentials are not valid.") {
                        navigate('/sign-in', { replace: true });
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptorId);
        };
    }, [navigate]);

    return (
        <div className="">
            <Header />

            <div>
                <Outlet />
            </div>
        </div>
    );
}
