import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json()
    
    // Supabaseから他のブログ記事を取得（最新の3つ）
    const supabase = await createClient()
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select(`
        id,
        title,
        content,
        image_url,
        created_at,
        profiles (
          name
        )
      `)
      .neq('id', blogId) // 現在のブログを除外
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }

    // シンプルなレコメンド理由を生成
    const reasons = blogs?.map((blog, index) => ({
      id: blog.id,
      title: blog.title,
      reason: `最新の投稿${index + 1}番目`
    })) || []

    return NextResponse.json({ 
      recommendations: blogs,
      reasons: reasons
    })

  } catch (error) {
    console.error('Simple recommendation error:', error)
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 })
  }
} 