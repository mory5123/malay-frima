import BlogListClient from "@/components/blog/BlogListClient"

export default function MainPage() {
    return <BlogListClient />
}


/*import { createClient } from "@/utils/supabase/server"
import { Suspense } from "react"
import BlogItem from "@/components/blog/BlogItem"
import Loading from "@/app/loading"
import ClearSearchButton from "@/components/search/ClearSearchButton"

interface PageProps {
    searchParams?: Record<string, string | string[]>
    }

    // メインページ
    const MainPage = async ({ searchParams }: PageProps) => {
    const supabase = await createClient()

    const searchRaw = searchParams?.search
    const searchQuery =
        typeof searchRaw === "string"
        ? searchRaw
        : Array.isArray(searchRaw)
        ? searchRaw[0]
        : ""

    let query = supabase
        .from("blogs")
        .select(
        `
            *,
            profiles (
            name,
            avatar_url
            )
        `
        )

    if (searchQuery) {
        query = query.or(
        `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
        )
    }

    const { data: blogsData, error } = await query.order("updated_at", { ascending: false })

    if (!blogsData || error) {
        return <div className="text-center">商品が投稿されていません</div>
    }

    return (
        <Suspense fallback={<Loading />}>
        {searchQuery && <ClearSearchButton searchQuery={searchQuery} />}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {blogsData.map((blog) => (
            <BlogItem key={blog.id} blog={blog} />
            ))}
        </div>

        {searchQuery && blogsData.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
            「{searchQuery}」に一致する商品が見つかりませんでした。
            </div>
        )}
        </Suspense>
    )
}

export default MainPage
*/