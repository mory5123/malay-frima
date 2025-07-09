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
import { BlogSchema } from "@/schemas"
import { newBlog } from "@/actions/blog"
import { useRouter } from "next/navigation"
import ImageUploading, { ImageListType } from "react-images-uploading"
import toast from "react-hot-toast"
import Image from "next/image"
import FormError from "@/components/auth/FormError"
import imageCompression from "browser-image-compression"

interface BlogNewProps {
    userId: string
}

const locationOptions = [
    "クアラルンプール",
    "ペナン",
    "ジョホールバル",
    "イポー",
    "マラッカ",
    "コタキナバル",
    "クチン",
    "スランゴール州（ペタリンジャヤ・シャーアラム等）",
    "その他地域"
]

const categoryOptions = [
    "売ります・譲ります",
    "お互いサポート",
    "メンバー募集",
    "その他"
]

const BlogNew = ({ userId }: BlogNewProps) => {
    const router = useRouter()
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()
    const [imageUpload, setImageUpload] = useState<ImageListType>([])

    const form = useForm<z.infer<typeof BlogSchema>>({
        resolver: zodResolver(BlogSchema),
        defaultValues: {
            title: "",
            price: "",
            content: "",
            location: locationOptions[0],
            category: categoryOptions[0],
        },
    })

    // 送信
    const onSubmit = (values: z.infer<typeof BlogSchema>) => {
        setError("")

        let base64Images: string[] = []

        startTransition(async () => {
            try {
                if (imageUpload.length) {
                    base64Images = imageUpload.map(img => img.dataURL).filter(Boolean) as string[]
                }

                const res = await newBlog({
                    ...values,
                    base64Images,
                    userId,
                })

                if (res?.error) {
                    setError(res.error)
                    return
                }

                toast.success("出品を投稿しました")
                router.push("/")
                router.refresh()
            } catch (error) {
                console.error(error)
                setError("エラーが発生しました")
            }
        })
    }

    // 画像アップロード
    const onChangeImage = async (imageList: ImageListType) => {
        const compressedList: ImageListType = []
        for (const img of imageList) {
            if (img.file) {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                }
                const compressed = await imageCompression(img.file, options)
                const dataUrl = await imageCompression.getDataUrlFromFile(compressed)
                compressedList.push({ file: compressed, dataURL: dataUrl })
            }
        }
        setImageUpload(compressedList)
    }

    return (
        <div className="mx-auto max-w-screen-md">
            <div className="font-bold text-xl text-center mb-10">出品投稿</div>

            <div className="mb-5">
                <ImageUploading
                    multiple
                    value={imageUpload}
                    onChange={onChangeImage}
                    maxNumber={3}
                    acceptType={["jpg", "jpeg", "png", "webp", "heic"]}
                >
                    {({ imageList, onImageUpload, onImageUpdate, onImageRemove, dragProps }) => (
                        <div className="flex flex-col items-center justify-center">
                            <button
                                onClick={onImageUpload}
                                className="w-full max-w-sm aspect-[4/3] border-2 border-dashed rounded-md hover:bg-gray-50 p-4 flex flex-col items-center justify-center text-center mb-4"
                                {...dragProps}
                                type="button"
                                disabled={imageList.length >= 3}
                            >
                                <div className="text-gray-400 font-bold mb-2 text-sm">
                                    ファイル選択またはドラッグ＆ドロップ（最大3枚）
                                </div>
                                <div className="text-gray-400 text-xs">
                                    ファイル形式：jpg / jpeg / png
                                </div>
                                <div className="text-gray-400 text-xs">
                                    ファイルサイズ：2MBまで
                                </div>
                            </button>
                            <div className="flex gap-4">
                                {imageList.map((image, index) => (
                                    <div key={index} className="relative">
                                        {image.dataURL && (
                                            <Image
                                                src={image.dataURL}
                                                alt={`image${index+1}`}
                                                width={180}
                                                height={120}
                                                className="rounded border"
                                            />
                                        )}
                                        <div className="flex justify-center mt-1 gap-2">
                                            <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); onImageUpdate(index) }}>変更</Button>
                                            <Button size="sm" variant="destructive" onClick={(e) => { e.preventDefault(); onImageRemove(index) }}>削除</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </ImageUploading>
            </div>

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
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">価格（リンギット）</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">取り引き場所</FormLabel>
                                <FormControl>
                                    <select {...field} disabled={isPending} className="w-full border rounded px-3 py-2">
                                        {locationOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">カテゴリー</FormLabel>
                                <FormControl>
                                    <select {...field} disabled={isPending} className="w-full border rounded px-3 py-2">
                                        {categoryOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
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
                                        placeholder=""
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
                            className="w-full space-x-2 font-bold"
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

export default BlogNew
