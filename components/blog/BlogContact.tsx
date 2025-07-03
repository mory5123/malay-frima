"use client"

import { useState, useTransition } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
        Form,
        FormControl,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { ContactSchema } from "@/schemas"
import { useRouter } from "next/navigation"
import { BlogType } from "@/types"
import toast from "react-hot-toast"
import FormError from "@/components/auth/FormError"
import { sendContact } from "@/actions/contact"

interface BlogContactProps {
        blog: BlogType,
        sender_email: string | undefined,
        receiver_email: string | undefined
}

const BlogContact = ({ blog,sender_email,receiver_email }: BlogContactProps) => {
        const router = useRouter()
        const [error, setError] = useState("")
        const [isPending, startTransition] = useTransition()

        const form = useForm<z.infer<typeof ContactSchema>>({
                resolver: zodResolver(ContactSchema),
                defaultValues: {
                        title: `「${blog.title}」に関するお問い合わせ（マレー・フリマ）`,
                        content: "",
                },
        })

        // 送信
        const onSubmit = (values: z.infer<typeof ContactSchema>) => {
                setError("")

                startTransition(async () => {
                        try {
                        const res = await sendContact({
                                title: values.title,
                                content: values.content,
                                sender_email: sender_email ?? '',
                                receiver_email: receiver_email ?? '',
                        })

                        if (res?.error) {
                                setError(res.error)
                                return
                        }

                        toast.success("メールを送信しました！")
                        router.push(`/blog/${blog.id}`)
                        router.refresh()
                        } catch (error) {
                        console.error("メール送信エラー:", error)
                        const message = error instanceof Error
                        ? error.message
                        : "不明なエラーが発生しました"

                        setError(`送信に失敗しました: ${message}`)
                        }
                })
                }

        return (
                <div className="mx-auto max-w-screen-md">
                        <div className="font-bold text-xl text-center mb-3">出品者へメールで問い合わせ</div>
                        <div className="font-bold text-x1 text-center mb-5">お客様の登録されたメールアドレスから出品者のメールアドレスへ連絡します</div>

                        <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                        <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                        <FormItem>
                                                                <FormLabel className="font-bold">タイトル</FormLabel>
                                                                <FormControl>
                                                                        <Input placeholder="" {...field} disabled={isPending} />
                                                                </FormControl>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}
                                        />

                                        <FormField
                                                control={form.control}
                                                name="content"
                                                render={({ field }) => (
                                                        <FormItem>
                                                                <FormLabel className="font-bold">内容</FormLabel>
                                                                <FormControl>
                                                                        <Textarea
                                                                                placeholder="初めまして、こちらの商品に興味がありまして、お問い合わせさせて頂きます。"
                                                                                rows={10}
                                                                                {...field}
                                                                                disabled={isPending}
                                                                        />
                                                                </FormControl>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}
                                        />

                                        <div className="space-y-4 w-full">
                                                <FormError message={error} />

                                                <Button
                                                        type="submit"
                                                        className="w-full flex items-center justify-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white space-x-2 font-bold"  
                                                        disabled={isPending}
                                                >
                                                        {isPending && <Loader2 className="animate-spin" />}
                                                        <span>送信</span>
                                                </Button>
                                        </div>
                                </form>
                        </Form>
                </div>
        )
}

export default BlogContact
