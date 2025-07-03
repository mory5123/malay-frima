"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { createClient } from "@/utils/supabase/client"
import {ProfileType} from "@/types"

const PhoneSchema = z.object({
    countryCode: z.string().min(1, { message: "国番号を入力してください" }),
    phone: z.string().min(6, { message: "電話番号を入力してください" }),
    })

    export default function PhoneVerifyPage() {
    const [isPending, setIsPending] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState("")
    const [profile, setProfile] = useState<ProfileType|null>(null)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [code, setCode] = useState("")
//    const [user, setUser] = useState<any>(null)

    const form = useForm<z.infer<typeof PhoneSchema>>({
        resolver: zodResolver(PhoneSchema),
        defaultValues: {
        countryCode: "60", // マレーシア例
        phone: "",
        },
    })

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            setLoadingProfile(true)
            const supabase = createClient()
            const { data: userData } = await supabase.auth.getUser()
            //setUser(userData?.user)
            if (userData?.user?.id) {
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userData.user.id)
                    .single()
                setProfile(profileData)
            }
            setLoadingProfile(false)
        }
        fetchUserAndProfile()
    }, [])

    // SMS送信
    const handleSendSMS = async (values: z.infer<typeof PhoneSchema>) => {
        setIsPending(true)
        setError("")
        try {
        // Supabase Auth APIで電話番号を登録（Vonage移行のためコメントアウト）
        // const supabase = createClient()
        // const { data: updateUserData, error: updateError } = await supabase.auth.updateUser({
        //   phone: `+${values.countryCode}${values.phone}`
        // })
        // console.log("updateUserData:", updateUserData);
        // console.log("updateError:", updateError);
        // if (updateError) throw new Error(updateError.message)
        
        /* SupabaseのTwilio機能だとProviderがPhoneに切り替わるので、自作APIにする最終的に。
        const supabase = createClient()
        setPhoneNumber(`${form.getValues("countryCode")}${form.getValues("phone")}`)
        const {data,error} = await supabase.auth.signInWithOtp({phone: phoneNumber})*/
        
        const res = await fetch("/api/phone/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        })
        const data = await res.json()
        
        console.log("SMS送信後Data、",data)
        //console.log("SMS送信後Error、",error)

        if (!res.ok) throw new Error(data.error || "SMS送信に失敗しました")
        //if (error) throw new Error(error.message || "SMS送信に失敗しました")

        setIsSent(true)
        toast.success("認証コードを送信しました")
        
        } catch (e) {
        console.error("updateUser error:", e);
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("SMS送信に失敗しました");
        }
        } finally {
        setIsPending(false)
        }
    }

    // 認証コード検証
    const handleVerify = async () => {
        setIsPending(true)
        setError("")
        try {

            /*    const supabase = createClient()
            const {data,error} = await supabase.auth.verifyOtp({
            phone: phoneNumber,
            token: code,
            type: "sms", // ← SMSによるOTP認証を指定
            })*/
        
        
        const res = await fetch("/api/phone/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                countryCode: form.getValues("countryCode"),
                phone: form.getValues("phone"),
                code,
            }),
            })

        if (!res.ok) throw new Error()
        //if(error) throw new Error(error.message)
        // 認証済みフラグを即時反映
        setIsVerified(true)
        
        // セッションをリフレッシュして最新のユーザー情報を取得
        const supabase = createClient()
        await supabase.auth.refreshSession()
        const { data, error} = await supabase.auth.getUser()
        //setUser(data.user)
        // profilesテーブルを更新
        if (error || !data?.user?.id) {
            setError("ユーザー情報の取得に失敗しました")
            return
        }
        
        if (data.user?.id) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                phone_number: `+${form.getValues("countryCode")}${form.getValues("phone")}`, //form.getValues("phone"),
                country_code: form.getValues("countryCode"),     
                phone_verified: true
                })
                .eq('id', data.user.id)
            if (profileError) {
                setError("プロフィール更新に失敗しました")
                return
            }
            }

        toast.success("電話番号が認証されました")
        } 
        
        catch {
        setError("認証に失敗しました")
        } finally {
        setIsPending(false)
        }
    }

    if (loadingProfile) {
        return <div className="text-center py-10">読み込み中...</div>
    }
    if (profile?.phone_verified) {
        return (
            <div> {/*className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center" */}
                <div className="font-bold text-xl text-center mb-5">✅電話番号は認証済みです</div>
                <div className="text-gray-700 text-left ">
                    電話番号の変更をご希望の方は、
                    <a href="/about#contact" className="text-blue-600 underline ml-1">問い合わせ先</a>
                    に直接ご連絡下さい。
                </div>
            </div>
        )
    }

    return (
        <div >   {/*className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow" */}
            <div className="font-bold text-xl text-center mb-5">電話番号認証</div>

                <div className="flex items-center text-sm text-gray-700 justify-center mb-2 ">
                    <span className="text-base mr-1">🔒</span>
                    本人確認（電話番号認証）をすると、より安全・スムーズにやりとりができます。認証後はアカウントに本人認証バッジ（✅）が付きます
                </div><br/>
            
            <Form {...form}>
                <form onSubmit={e => { e.preventDefault(); form.handleSubmit(handleSendSMS)(); }} className="space-y-5">
                    <div className="flex items-end gap-2">
                        <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>国番号</FormLabel>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-1">+</span>
                                        <FormControl>
                                            <Input type="text" placeholder="60" maxLength={4} style={{ width: 60 }} {...field} disabled={isPending || isSent} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>電話番号</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="123456789" {...field} disabled={isPending || isSent} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="text-xs text-gray-500">入力例その１: +60 123456789（国番号+電話番号、ハイフンなし<br/>
                        上記は、マレーシア番号の012-345-6789の場合）</div>
                    <div className="text-xs text-gray-500">入力例その２: +81 9023456789（日本番号の090-1234-5678の場合）</div>
                    {!isSent && (
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                            認証コードを送信
                        </Button>
                    )}
                </form>
            </Form>
            {isSent && !isVerified && (
                <form onSubmit={e => { e.preventDefault(); handleVerify(); }} className="mt-10 space-y-4">
                    <div>
                        <label className="block font-bold mb-1">認証コード</label>
                        <Input type="text" placeholder="SMSで届いたコード" value={code} onChange={e => setCode(e.target.value)} disabled={isPending} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                        認証する
                    </Button>
                </form>
            )}
            {error && (
                <div className="mt-4 text-red-500 flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </div>
            )}
            {isVerified && (
                <div className="mt-4 text-green-600 flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" /> 電話番号が認証されました
                </div>
            )}
        </div>
    )
} 