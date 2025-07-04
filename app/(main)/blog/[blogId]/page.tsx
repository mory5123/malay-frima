import { createClient } from "@/utils/supabase/server"
import { Suspense } from "react"
import BlogDetail from "@/components/blog/BlogDetail"
import Loading from "@/app/loading"

/*interface BlogDetailPageProps {
  params: {
    blogId: string
  }
}*/

type Props = {
    params: Promise<{
    blogId: string
    }>
}

const BlogDetailPage = async ({ params }:Props) => {
  const { blogId } = await params
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  // ブログ詳細取得
  const { data: blogData } = await supabase
    .from("blogs")
    .select(
      `
      *,
      profiles (
        name,
        avatar_url,
        introduce,
        phone_verified
      )
    `
    )
    .eq("id", blogId)
    .single()

  if (!blogData) {
    return <div className="text-center">投稿が存在しません</div>
  }

  // ログインユーザーがブログ作成者かどうか
  const isMyBlog = user?.id === blogData.user_id

  return (
    <Suspense fallback={<Loading />}>
      <BlogDetail blog={blogData} isMyBlog={isMyBlog} />
    </Suspense>
  )
}

export default BlogDetailPage