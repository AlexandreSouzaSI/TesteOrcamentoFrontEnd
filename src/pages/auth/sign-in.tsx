import { signIn } from "@/api/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signInForm = z.object({
    email: z.string().email(),
    password: z.string()
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInForm>({
        defaultValues: {
            email: searchParams.get('email') ?? ''
        }
    })

    const { mutateAsync: authenticate } = useMutation({
        mutationFn: signIn,
    })

    
    async function handleSignIn(data: SignInForm) {
        try {
            const response = await authenticate({ email: data.email, password: data.password })

            if (response.access_token) {
                localStorage.setItem('token', response.access_token)
                
                navigate('/')

                toast.success('Login bem-sucedido')
            } else {
                toast.error('Token não encontrado na resposta')
            }
        } catch (error) {
            toast.error('Credenciais inválidas')
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