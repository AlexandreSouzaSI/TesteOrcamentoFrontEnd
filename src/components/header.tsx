import { BadgeDollarSign, HandCoins, Home, NotebookPen } from 'lucide-react'
import { NavLink } from './nav-link'
import { Separator } from './ui/separator'
import { ThemeToggle } from './theme/theme-toggle'
import { AccountFinance } from './account-finance'

export function Header() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center gap-6 px-6">
                <BadgeDollarSign className='h-6 w-6' />
                <Separator orientation='vertical' className='h-6'/>

                <nav className='flex items-center space-x-4 lg:space-x-6'>
                    <NavLink to="/">
                        <Home className='h-4 w-4'/>
                        Inicio
                    </NavLink>
                    <NavLink to="/budgets">
                        <NotebookPen className='h-4 w-4'/>
                        Orcamentos
                    </NavLink>
                    <NavLink to="/income">
                        <HandCoins className='h-4 w-4'/>
                        Renda
                    </NavLink>
                </nav>
                <div className='ml-auto flex items-center gap-2'>
                    <ThemeToggle />
                    <AccountFinance />
                </div>
            </div>
        </div>
    )
}