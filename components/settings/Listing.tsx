import { createClient } from "@/utils/supabase/server"
import { Suspense } from "react"
import BlogItem from "@/components/blog/BlogItem"
import Loading from "@/app/loading"
import { ProfileType } from "@/types"

interface ProfileProps {
    profile: ProfileType
}

// 自分の出品一覧
const Listing = async ({ profile }: ProfileProps) => {
    const supabase = await createClient()

    //一覧取得
    const { data: blogsData, error } = await supabase
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
        .eq("user_id", profile.id)
        .order("updated_at", { ascending: false })

    if (!blogsData || error) {
        return <div className="text-center">商品が投稿されていません</div>
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {blogsData.map((blog) => {
                    return <BlogItem key={blog.id} blog={blog} />
                })}
            </div>
        </Suspense>
    )
}

export default Listing
