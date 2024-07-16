import { Helmet } from "react-helmet-async";
import { MonthRevenueCard } from "./month-revenueCard";
import { MonthBudgetsCard } from "./month-budgetsCard";
import { MonthIncomeCard } from "./month-IncomeCard";
import { RevenueChart } from "./revenue-chart";
import { PopularBudgetsChart } from "./popular-budgets-chart";

export function Dashboard() {
    return (
        <>
            <Helmet title="Dashboard" />
            <div className="flex flex-col gap-4 p-10">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

                <div className="grid grid-cols-3 gap-4">
                    <MonthIncomeCard />
                    <MonthBudgetsCard />
                    <MonthRevenueCard  />
                </div>
                <div className="grid grid-cols-9 gap-4">
                    <RevenueChart />
                    <PopularBudgetsChart />
                </div>
            </div>
        </>
    )
}