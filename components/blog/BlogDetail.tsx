"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { BlogType } from "@/types"
import { format } from "date-fns"
import { FilePenLine, Loader2, Trash2, MessageCircle } from "lucide-react"
import { deleteBlog } from "@/actions/blog"
import FormError from "@/components/auth/FormError"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import FavoriteButton from "@/components/FavoriteButton"
import ShareButtons from "@/components/social/ShareButtons"
// import Recommendations from "@/components/recommendations/Recommendations"
import { Button } from "@/components/ui/button"
import ConfirmationModal from "@/components/ConfirmationModal"
import ImageGallery from "./ImageGallery"

interface BlogDetailProps {
    blog: BlogType & {
        profiles: {
            name: string
            avatar_url: string | null
            introduce: string | null
            phone_verified: boolean
        }
    }
    isMyBlog: boolean
}

const BlogDetail = ({ blog, isMyBlog }: BlogDetailProps) => {
    const router = useRouter()
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleDelete = async () => {
        
        /*if (!window.confirm("本当に削除しますか？")) {
            return
        }*/
        setError("")
        startTransition(async () => {
            try {
                const res = await deleteBlog({
                    blogId: blog.id,
                    imageUrl: blog.image_url || null,
                    imageUrls: blog.image_urls || null,
                    userId: blog.user_id,
                })
                if (res?.error) {
                    setError(res.error)
                    return
                }
                toast.success("投稿情報を削除しました")
                router.push("/")
                router.refresh()
            } catch (error) {
                console.error(error)
                setError("エラーが発生しました")
            }
        })
    }

    // 問い合わせボタンのハンドラー
    const handleContact = () => {
        router.push(`/blog/${blog.id}/contact`)
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="col-span-2 space-y-5">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {"last update: " + format(new Date(blog.updated_at), "yyyy/MM/dd")}
                        </div>
                        <FavoriteButton postId={blog.id} />
                    </div>

                    {/* タイトル */}
                    <div className="font-bold text-xl mb-3">{blog.title}</div>

                    {/* 情報（縦並び、無地、黒文字、動的部分のみ太字） */}
                    <div className="space-y-1 mb-4 text-sm text-black">
                        <p>
                            希望価格(MYR): <span className="font-bold">{blog.price}</span>
                        </p>
                        <p>
                            取引場所: <span className="font-bold">{blog.location}</span>
                        </p>
                        <p>
                            カテゴリー: <span className="font-bold">{blog.category}</span>
                        </p>
                    </div>
                    
                    {/*
                    <div className="font-bold text-2xl">{blog.title}</div>
                    <div className="flex flex-wrap gap-4 mb-2">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold">
                            希望価格(MYR): {blog.price}
                        </span>
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold">
                            取り引き場所: {blog.location}
                        </span>
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold">
                            カテゴリー: {blog.category}
                        </span>
                    </div> */}
                    
                    {/* 複数画像表示 */}
                    <div className="space-y-4">
                        <ImageGallery images={blog.image_urls && blog.image_urls.length > 0 ? blog.image_urls : ["/noImage.png"]} />
                    </div>
                    <div className="leading-relaxed break-words whitespace-pre-wrap">
                        {blog.content}
                    </div>
                    
                    {/* SNSシェアボタン */}
                    <div className="border-t pt-2">
                        <ShareButtons
                            title={blog.title}
                            url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.id}`}
                            description={blog.content.substring(0, 100) + '...'}
                        />
                    </div>

                    {/* 
                    {isMyBlog && (
                        <div className="flex items-center justify-end space-x-3">
                            <Link href={`/blog/${blog.id}/edit`}>
                                <FilePenLine className="w-6 h-6" />
                            </Link>
                            <button
                                className="cursor-pointer"
                                onClick={handleDelete}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                                ) : (
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                )}
                            </button>
                        </div>
                    )}*/}

                    <FormError message={error} />
                </div>
                
                <div className="col-span-1">
                    <div className="border rounded flex flex-col items-center justify-center space-y-4 p-5">
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden flex-shrink-0">
                            <Image
                                src={blog.profiles.avatar_url || "/default.png"}
                                alt="avatar"
                                width={100}
                                height={100}
                                className="object-cover"
                                priority
                                style={{ width: "100px", height: "100px" }}
                            />
                        </div>
                        <div className="font-bold text-center">{blog.profiles.name}</div>
                        {blog.profiles.phone_verified === true && (
                            <div className="text-green-600 text-center text-sm font-bold">✅本人認証済</div>
                        )}
                        <div className="text-sm text-center">{blog.profiles.introduce}</div>
                        
                        {/* 出品者への問い合わせボタン */}
                        {!isMyBlog && (
                            <Button
                                onClick={handleContact}
                                className="w-full flex items-center justify-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>投稿者に問い合わせ</span>
                            </Button>
                        )}

                        {/* 編集・削除ボタン（自分のブログの場合のみ表示） */}
                        {isMyBlog && (
                            <div className="flex flex-col w-full space-y-2 pt-4">
                                <Link href={`/blog/${blog.id}/edit`} className="w-full">
                                    <Button className="w-full flex items-center space-x-2" variant="outline">
                                        <FilePenLine className="w-5 h-5" />
                                        <span>この投稿を編集</span>
                                    </Button>
                                </Link>
                                <Button
                                    //onClick={handleDelete}
                                    onClick={() => setIsModalOpen(true)} // ここが変更点
                                    className="w-full flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                    <span>この投稿を削除</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AIレコメンド機能 - 一時的に無効化 */}
            {/* <Recommendations currentBlog={blog} /> */}
            {/* 削除確認モーダル */}
            <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDelete}
            />
        </div>
    )
}

export default BlogDetail
