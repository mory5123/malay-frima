import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

interface RecommendationItem {
  id: string
  title: string
  reason: string
}

interface RecommendationResponse {
  recommendations: RecommendationItem[]
}

// Supabaseクエリの結果型を定義
interface BlogWithProfile {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
  profiles: {
    name: string
  }[] | null
}

export async function POST(request: NextRequest) {
  try {
    const { blogId, title, content } = await request.json()
    
    // Supabaseから他のブログ記事を取得
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
      .limit(10)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }

    // 型アサーションを使用してblogsの型を明確にする
    const typedBlogs = blogs as unknown as BlogWithProfile[]

    // ChatGPT APIに送信するプロンプトを作成
    const prompt = `
以下の商品情報を基に、類似の商品を3つレコメンドしてください。

現在の商品:
タイトル: ${title}
内容: ${content}

利用可能な商品一覧:
${typedBlogs?.map(blog => {
  // profiles が null、空配列、または要素がある配列のすべてに対応
  const profileName = blog.profiles && blog.profiles.length > 0 
    ? blog.profiles[0].name 
    : 'Unknown'
  return `
- タイトル: ${blog.title}
- 内容: ${blog.content.substring(0, 200)}...
- 出品者: ${profileName}
`
}).join('\n')}

レコメンドの条件:
1. 現在の商品と類似性が高い商品
2. 価格帯やカテゴリが近い商品
3. 人気度や評価を考慮

回答形式:
{
  "recommendations": [
    {
      "id": "商品ID",
      "title": "商品タイトル",
      "reason": "レコメンド理由"
    }
  ]
}
`

    // OpenAI APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not set')
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 })
    }

    // ChatGPT APIを呼び出し
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'あなたは商品レコメンドの専門家です。ユーザーの好みに基づいて最適な商品を推薦してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      throw new Error('Failed to get recommendations from ChatGPT')
    }

    const data = await response.json()
    const recommendations = JSON.parse(data.choices[0].message.content) as RecommendationResponse

    // レコメンドされた商品の詳細情報を取得
    const recommendedBlogs = typedBlogs?.filter(blog => 
      recommendations.recommendations.some((rec: RecommendationItem) => rec.id === blog.id)
    )

    return NextResponse.json({ 
      recommendations: recommendedBlogs,
      reasons: recommendations.recommendations 
    })

  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 })
  }
}