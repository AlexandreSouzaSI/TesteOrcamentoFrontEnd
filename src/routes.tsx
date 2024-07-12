import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/auth/sign-in";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { SignUp } from "./pages/auth/sign-up";
import { Budgets } from "./pages/app/budgets/budgets";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import { Income } from "./pages/app/income/income";
import { NotFound } from "./pages/404";

export const router = createBrowserRouter([
    { 
        path: '/', 
        element: <AppLayout />,
        errorElement: <NotFound />,
        children: [
         { path: '/', element: <Dashboard /> },
         { path: '/budgets', element: <Budgets /> },
         { path: '/income', element: <Income /> },
      ]
     },
     { 
        path: '/', 
        element: <AuthLayout />,
        children: [
         { path: '/sign-in', element: <SignIn /> },
         { path: '/sign-up', element: <SignUp /> }
      ]
     },
])