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
import { editBlog } from "@/actions/blog"
import { useRouter } from "next/navigation"
import { BlogType } from "@/types"
import ImageUploading, { ImageListType } from "react-images-uploading"
import toast from "react-hot-toast"
import Image from "next/image"
import FormError from "@/components/auth/FormError"
import imageCompression from "browser-image-compression"

interface BlogEditProps {
    blog: BlogType
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

const BlogEdit = ({ blog }: BlogEditProps) => {
    const router = useRouter()
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()
    
    // 既存の画像URLを初期値として設定
    const initialImages: ImageListType = []
    if (blog.image_urls && blog.image_urls.length > 0) {
        blog.image_urls.forEach((url) => {
            if (url && url !== "/noImage.png") {
                initialImages.push({ dataURL: url })
            }
        })
    }
    
    // 既存の画像がない場合はデフォルト画像を追加
    if (initialImages.length === 0) {
        initialImages.push({ dataURL: blog.image_url || "/noImage.png" })
    }
    
    const [imageUpload, setImageUpload] = useState<ImageListType>(initialImages)

    const form = useForm<z.infer<typeof BlogSchema>>({
        resolver: zodResolver(BlogSchema),
        defaultValues: {
            title: blog.title,
            price: blog.price || "",
            content: blog.content,
            location: blog.location || locationOptions[0],
            category: blog.category || categoryOptions[0],
        },
    })

    // 送信
    const onSubmit = (values: z.infer<typeof BlogSchema>) => {
        setError("")

        console.log('onSubmit values:', values)

        const base64Images: string[] = []

        startTransition(async () => {
            try {
                // 現在表示されているすべての画像を収集
                imageUpload.forEach((image) => {
                    if (image.dataURL) {
                        if (image.dataURL.startsWith("data:image")) {
                            // 新しくアップロードされた画像（base64形式）
                            base64Images.push(image.dataURL)
                        } else if (image.dataURL.startsWith("http")) {
                            // 既存の画像URL（HTTP/HTTPS）
                            base64Images.push(image.dataURL)
                        }
                    }
                })

                console.log('base64Images count:', base64Images.length)
                console.log('imageUpload count:', imageUpload.length)
                console.log('imageUpload:', imageUpload.map(img => img.dataURL?.substring(0, 50)))

                const res = await editBlog({
                    ...values,
                    blogId: blog.id,
                    imageUrl: blog.image_url || null,
                    base64Images,
                    userId: blog.user_id,
                })

                if (res?.error) {
                    setError(res.error)
                    return
                }

                toast.success("投稿した情報を編集しました")
                router.push(`/blog/${blog.id}`)
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
            } else if (img.dataURL) {
                // 既存画像（URLのみ）
                compressedList.push(img)
            }
        }
        setImageUpload(compressedList)
    }

    return (
        <div className="mx-auto max-w-screen-md">
            <div className="font-bold text-xl text-center mb-10">投稿情報の編集</div>

            <div className="mb-5">
                <ImageUploading
                    value={imageUpload}
                    onChange={onChangeImage}
                    maxNumber={3}
                    multiple
                    acceptType={["jpg", "jpeg", "png", "webp", "heic"]}
                >
                    {({ imageList, onImageUpload, onImageUpdate, onImageRemove, dragProps }) => (
                        <div className="flex flex-col items-center justify-center">
                            {imageList.length === 0 && (
                                <button
                                    onClick={onImageUpload}
                                    className="aspect-video w-full border-2 border-dashed rounded hover:bg-gray-50"
                                    {...dragProps}
                                >
                                    <div className="text-gray-400 font-bold mb-2 text-sm">
                                        ファイル選択またはドラッグ＆ドロップ
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        ファイル形式：jpg / jpeg / png
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        ファイルサイズ：2MBまで（最大3枚）
                                    </div>
                                </button>
                            )}

                            {imageList.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                    {imageList.map((image, index) => (
                                        <div key={index} className="relative">
                                            {image.dataURL && (
                                                <div className="relative">
                                                    <Image
                                                        src={image.dataURL}
                                                        alt={`image-${index}`}
                                                        width={300}
                                                        height={200}
                                                        className="w-full h-48 object-cover rounded"
                                                        priority={index === 0}
                                                    />
                                                    <div className="absolute top-2 right-2 flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                onImageUpdate(index)
                                                            }}
                                                            className="bg-white/80 hover:bg-white"
                                                        >
                                                            変更
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                onImageRemove(index)
                                                            }}
                                                            className="bg-red-500/80 hover:bg-red-500"
                                                        >
                                                            削除
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {imageList.length > 0 && imageList.length < 3 && (
                                <div className="text-center mt-3">
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            onImageUpload()
                                        }}
                                    >
                                        画像を追加
                                    </Button>
                                </div>
                            )}
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

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">希望価格</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} disabled={isPending} />
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
                            <span>編集</span>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default BlogEdit
