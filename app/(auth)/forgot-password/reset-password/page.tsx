"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

const ResetPasswordPage = () => {
    const router = useRouter()
    const supabase = createClient()

    const [newPassword, setNewPassword] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        // リダイレクトで遷移したときに、トークンからセッションを復元
        supabase.auth.getSession().catch((err) => {
        console.error("セッション取得エラー:", err)
        })
    }, [supabase.auth])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)

        const { error } = await supabase.auth.updateUser({ password: newPassword })

        if (error) {
        toast.error("更新に失敗しました: " + error.message)
        } else {
        toast.success("パスワードを更新しました")
        router.push("/login")
        }

        setIsUpdating(false)
    }

    return (
        <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4">
            <div className="text-center">
            <h1 className="text-2xl font-bold">パスワードを再設定</h1>
            <p className="mt-2 text-sm text-gray-600">
                新しいパスワードを入力してください。
            </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6 mt-8">
            <div className="space-y-4">
                <div>
                <Label htmlFor="newPassword">新しいパスワード</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1"
                />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? "更新中..." : "パスワードを更新"}
            </Button>
            </form>
        </div>
        </div>
    )
    }

    export default ResetPasswordPage
