import { registerUser } from "@/api/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signUpForm = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignUpForm>()

    const { mutateAsync: registerUserFn } = useMutation({
        mutationFn: registerUser,
    })

    async function handleSignUp(data: SignUpForm) {
        try {
            await registerUserFn({
                name: data.name,
                email: data.email,
                password: data.password
            })
            toast.success('Conta registrada com sucesso', {
                action: {
                    label: 'Login',
                    onClick: () => navigate(`/sign-in?email=${data.email}`)
                }
            })
        } catch (error) {
            toast.error('Erro ao Cadastrar')
        }
    }

    return (
        <>
            <Helmet title="Login" />
            <div className="p-8">
            <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/sign-in">
                        Fazer Login
                    </Link>
                </Button>

                <div className="w-[350px] flex flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Criar Conta
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Crie sua conta e administre suas finanças!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email"> Nome</Label>
                            <Input id="name" type="name" {...register('name')}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email"> E-mail</Label>
                            <Input id="email" type="email" {...register('email')}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password"> Senha</Label>
                            <Input id="password" type="password"{...register('password')}/>
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">Finalizar Cadastro</Button>
                    </form>
                </div>
            </div>
        </>
    )
}