import { Header } from "@/components/header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    return (
        <div className="">
            <Header />

            <div>
                <Outlet />
            </div>
        </div>
    )
}