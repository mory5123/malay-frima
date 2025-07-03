"use client"

import { BlogType } from "@/types"
import Image from "next/image"
import Link from "next/link"

interface BlogItemProps {
    blog: BlogType & {
        profiles: {
            name: string
            avatar_url: string
        }
    }
}

const BlogItem = ({ blog }: BlogItemProps) => {
    // image_urlsのみを使用し、最初の画像を表示
    const displayImageUrl = blog.image_urls && blog.image_urls.length > 0 
        ? blog.image_urls[0] 
        : "/noImage.png"

    return (
        <div className="break-words border rounded">
            <Link href={`/blog/${blog.id}`}>
                <div className="aspect-video relative w-full overflow-hidden bg-gray-100">
                    <Image
                        src={displayImageUrl}
                        alt="image"
                        fill
                        className="object-contain rounded-t"
                        sizes="(max-width: 768px) 100vw, 640px"
                        priority
                    />
                </div>
            </Link>

            <div className="p-3 space-y-1">
                {/*<div className="text-gray-500 text-xs">
                    {format(new Date(blog.updated_at), "yyyy/MM/dd")}
                </div> */}
                <div className="font-bold text-sm">{blog.price} MYR</div>
                <div className="text-sm truncate max-w-5xl">{blog.title}</div>

                <div className="text-xs text-blue-700 bg-white border border-blue-200 rounded px-2 py-0.5 inline-block font-semibold mt-1">
                    {blog.location}
                </div>
            </div>
        </div>
    )
}

export default BlogItem
