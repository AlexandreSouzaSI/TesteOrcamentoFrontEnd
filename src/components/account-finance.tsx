import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCog, ChevronDown, LogOut } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/get-profile";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { StoreProfileDialog } from "./store-profile-dialog";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/logout";

export function AccountFinance() {
    const navigate = useNavigate()

    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: Infinity,
    });

    const { mutateAsync: signOutFn, isPending: isSigninOut } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            navigate('/sign-in', { replace: true });
        }
    });

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 select-none">
                        {profile?.user.name}
                        <ChevronDown className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col">
                        <span>{profile?.user.name}</span>
                        <span className="text-xs font-normal text-muted-foreground">{profile?.user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4"/>
                            <span>Perfil do usuario</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400">
                        <button className="w-full" onClick={() => signOutFn()}>
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span>Sair</span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <StoreProfileDialog />
        </Dialog>
    )
}