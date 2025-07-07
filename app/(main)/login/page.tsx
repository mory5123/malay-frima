"use client"

import { useState,useRef,useEffect } from "react"
import { useRouter,useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import toast from "react-hot-toast"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    //const [hasShownToast, setHasShownToast] = useState(false)
    const hasShownToast = useRef(false)


    // ✅ クエリパラメータからエラー取得してトースト表示
    useEffect(()=>{
        const error = searchParams.get("error")
        //console.log("Error is ",error)
        if(error==="unauthenticated_contact" && !hasShownToast.current){
            hasShownToast.current = true
            toast.error("お問い合わせ機能を使用するにはログインが必要です")
            //setHasShownToast(true)
            
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete("error")
            router.replace(`/login?${newParams.toString()}`)
        }
    },[searchParams,router])

    // メールアドレスとパスワードでのログイン
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            router.push("/")
            router.refresh()
        } catch {
            toast.error("ログインに失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    // Googleログイン
    const handleGoogleLogin = async () => {
        try {

            //const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                    //redirectTo: siteUrl ? `${siteUrl}/auth/callback` : undefined
                }
            })

            if (error) {
                toast.error(error.message)
            }
        } catch {
            toast.error("Googleログインに失敗しました")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-8 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">ログイン</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        アカウントをお持ちでない方は
                        <a href="/signup" className="text-blue-600 hover:text-blue-500">
                            会員登録
                        </a>
                        へ
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* Googleログインボタン */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle className="h-5 w-5" />
                        Googleでログイン
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">または</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">パスワード</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "ログイン中..." : "ログイン"}
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-600 mt-4">
                    パスワードをお忘れですか？{" "}
                    <a href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
                        パスワードをリセット
                    </a>
                    </p>
                </div>
                
            </div>
        </div>
    )
}

export default LoginPage 