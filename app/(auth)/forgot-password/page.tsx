"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [success, setSuccess] = useState(false)

    const supabase = createClient()

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSending(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password/reset-password`, // 再設定ページ
        })

        if (error) {
        toast.error(error.message)
        } else {
        toast.success("リセットリンクをメールで送信しました")
        setSuccess(true)
        }

        setIsSending(false)
    }

    return (
        <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4">
            <div className="text-center">
            <h1 className="text-2xl font-bold">パスワードリセット</h1>
            <p className="mt-2 text-sm text-gray-600">
                登録したメールアドレスを入力してください。<br />
                リセット用リンクをメールでお送りします。
            </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6 mt-8">
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
            </div>

            <Button type="submit" className="w-full" disabled={isSending || success}>
                {isSending ? "送信中..." : "リセットリンクを送信"}
            </Button>

            <p className="text-sm text-center text-gray-600 mt-4">
                ログインページへ戻る{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                ログイン
                </a>
            </p>
            </form>
        </div>
        </div>
    )
    }

export default ForgotPasswordPage
