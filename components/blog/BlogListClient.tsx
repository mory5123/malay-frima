// components/blog/BlogListClient.tsx

"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import BlogItem from "./BlogItem"
import Loading from "@/app/loading"
import ClearSearchButton from "../search/ClearSearchButton"

const PAGE_SIZE = 25

export default function BlogListClient() {
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("search") || ""

    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const supabase = await createClient()

            let query = supabase
                .from("blogs")
                .select(
                    `*, profiles ( name, avatar_url )`,
                    { count: "exact" }
                )

            if (searchQuery) {
                query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
            }

            const from = (page - 1) * PAGE_SIZE
            const to = from + PAGE_SIZE - 1

            const { data, error, count } = await query
                .order("updated_at", { ascending: false })
                .range(from, to)

            if (!error) {
                setBlogs(data || [])
                setTotalCount(count || 0)
            }
            setLoading(false)
        }

        fetchData()
    }, [searchQuery, page])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    if (loading) return <Loading />

    return (
        <>
            {searchQuery && <ClearSearchButton searchQuery={searchQuery} />}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {blogs.map((blog) => (
                    <BlogItem key={blog.id} blog={blog} />
                ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        前へ
                    </button>
                    <span>
                        {page} / {totalPages}
                    </span>
                    <button
                        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        次へ
                    </button>
                </div>
            )}

            {searchQuery && blogs.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    「{searchQuery}」に一致する商品が見つかりませんでした。
                </div>
            )}
        </>
    )
}

/* Algolia 使った場合。  
"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { searchBlogs  } from "@/utils/algolia"
import BlogItem from "./BlogItem"
import Loading from "@/app/loading"
import ClearSearchButton from "../search/ClearSearchButton"

export default function BlogListClient() {
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("search") || ""

    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // Algolia検索を優先（検索語がある場合）
            if (searchQuery) {
                try {
                    const hits = await searchBlogs(searchQuery)
                    console.log("Algolia search starting ! ")
                    setBlogs(hits)
                } catch (err) {
                    console.error("Algolia検索エラー:", err)
                    setBlogs([]) // fallback
                }
            } else {
                // Supabaseから最新ブログを取得
                const supabase = createClient()
                const { data, error } = await supabase
                    .from("blogs")
                    .select(
                        `*, profiles ( name, avatar_url )`
                    )
                    .order("updated_at", { ascending: false })
                if (!error) setBlogs(data || [])
            }

            setLoading(false)
        }

        fetchData()
    }, [searchQuery])

    if (loading) return <Loading />

    return (
        <>
            {searchQuery && <ClearSearchButton searchQuery={searchQuery} />}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {blogs.map((blog: any) => (
                    <BlogItem key={blog.objectID || blog.id} blog={blog} />
                ))}
            </div>
            {searchQuery && blogs.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    「{searchQuery}」に一致する商品が見つかりませんでした。
                </div>
            )}
        </>
    )
}
*/

