import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import BlogEdit from "@/components/blog/BlogEdit"
import Loading from "@/app/loading"

/*interface BlogEditPageProps {
    params: {
        blogId: string
    }
}*/

type Props = {
    params: Promise<{
    blogId: string
    }>
}

const BlogEditPage = async ({ params }:Props) => {
    const { blogId } = await params
    const supabase = await createClient()

    //console.log("BlogEditPage,params is ",params)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
        redirect("/")
    }

    // ブログ詳細取得
    const { data: blogData } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single()

    if (!blogData) {
        return <div className="text-center">商品が存在しません</div>
    }

    // ブログ作成者とログインユーザーが一致しない場合
    if (blogData.user_id !== user.id) {
        redirect(`/blog/${blogData.id}`)
    }

    return (
        <Suspense fallback={<Loading />}>
            <BlogEdit blog={blogData} />
        </Suspense>
    )
}

export default BlogEditPage
