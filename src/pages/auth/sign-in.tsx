import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signInForm = z.object({
    email: z.string().email(),
    password: z.string()
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInForm>()

    async function handleSignIn(data: SignInForm) {
        try {
            console.log(data)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            toast.success('Enviamos um link de autenticação para seu email', {
                action: {
                    label: 'Reenviar',
                    onClick: () => handleSignIn(data)
                }
            })
        } catch (error) {
            toast.error('Credenciais invalidas')
        }
    }

    return (
        <>
            <Helmet title="Login" />
            <div className="p-8">
                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/sign-up">
                        Cadastrar
                    </Link>
                </Button>

                <div className="w-[350px] flex flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Acessar painel
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Acompanhe suas finanças pelo painel
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email"> E-mail</Label>
                            <Input id="email" type="email" {...register('email')}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password"> Senha</Label>
                            <Input id="password" type="password"{...register('password')}/>
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">Acessar Painel</Button>
                    </form>
                </div>
            </div>
        </>
    )
}