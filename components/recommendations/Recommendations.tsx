"use client"

import { useState, useEffect } from "react"
import { BlogType } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Sparkles } from "lucide-react"
import toast from "react-hot-toast"

interface RecommendationsProps {
  currentBlog: BlogType
}

interface RecommendationReason {
  id: string
  title: string
  reason: string
}

// APIから返されるブログの型定義
interface BlogWithProfile extends BlogType {
  profiles: {
    name: string
  }
}

const Recommendations = ({ currentBlog }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<BlogWithProfile[]>([])
  const [reasons, setReasons] = useState<RecommendationReason[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blogId: currentBlog.id,
            title: currentBlog.title,
            content: currentBlog.content,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          // OpenAI APIのクォータエラーの場合は、シンプルなレコメンドを使用
          if (errorData.error && errorData.error.includes('quota')) {
            console.log('OpenAI API quota exceeded, using simple recommendations')
            await fetchSimpleRecommendations()
            return
          }
          throw new Error(errorData.error || 'Failed to fetch recommendations')
        }

        const data = await response.json()
        setRecommendations(data.recommendations || [])
        setReasons(data.reasons || [])
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        const errorMessage = error instanceof Error ? error.message : 'レコメンドの取得に失敗しました'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    // シンプルなレコメンド機能（最新の投稿を表示）
    const fetchSimpleRecommendations = async () => {
      try {
        const response = await fetch('/api/simple-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blogId: currentBlog.id,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setRecommendations(data.recommendations || [])
          setReasons(data.reasons || [])
        }
      } catch (error) {
        console.error('Error fetching simple recommendations:', error)
      }
    }

    fetchRecommendations()
  }, [currentBlog])

  if (isLoading) {
    return (
      <div className="border-t pt-6">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>レコメンドを生成中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-t pt-6">
        <div className="text-center text-gray-600">
          <p>レコメンド機能でエラーが発生しました</p>
          <p className="text-sm text-red-500 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="border-t pt-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">おすすめ商品</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((blog) => {
          const reason = reasons.find(r => r.id === blog.id)
          return (
            <div key={blog.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/blog/${blog.id}`}>
                <div className="aspect-video relative">
                  <Image
                    src={blog.image_url || "/noImage.png"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {blog.title}
                  </h4>
                  {reason && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {reason.reason}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{blog.profiles?.name}</span>
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Recommendations 