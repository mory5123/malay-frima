import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import BlogContact from "@/components/blog/BlogContact"
import Loading from "@/app/loading"

type Props = {
    params: Promise<{
    blogId: string
    }>
}

/*interface BlogContactPageProps {
    params: {
        blogId: string
    }
}*/

const BlogContactPage = async ({ params }: Props) => {
    const { blogId } = await params
    const supabase = await createClient()
    //const blogId = params.blogId
    //const supabase =  createClient()

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
        redirect("/login?error=unauthenticated_contact")
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

    //出品者のメールアドレス取得 
    const { data: receiver_email } = await supabase
    .from('blogs_with_emails')
    .select('email')
    .eq('user_id', blogData.user_id) // blogData.id でもOK
    .order('created_at', { ascending: false }) // 新しい順
    .limit(1)
    .single();
    console.log("sender email, ",receiver_email)

    // ブログ作成者とログインユーザーが一致しない場合
    if (blogData.user_id === user.id) {
        redirect(`/blog/${blogData.id}`)
    }

    //console.log("sender email, ",user.email)
    //console.log("receiver email, ",receiver_email?.email)

    return (
        <Suspense fallback={<Loading />}>
            <BlogContact blog={blogData} sender_email={user?.email} receiver_email={receiver_email?.email} />
        </Suspense>
    )
}

export default BlogContactPage
