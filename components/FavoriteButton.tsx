"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import toast from "react-hot-toast"

interface FavoriteButtonProps {
  postId: string
  className?: string
}

const FavoriteButton = ({ postId, className }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {

  const checkFavoriteStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('blog_id', postId)
        .single()

      setIsFavorite(!!data)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  checkFavoriteStatus()
}, [postId,supabase])

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('お気に入り機能を使用するにはログインが必要です')
        router.push('/login')
        return
      }

      if (isFavorite) {
        // お気に入りを削除
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('blog_id', postId)
        
        setIsFavorite(false)
        toast.success('お気に入りから削除しました')
      } else {
        // お気に入りを追加
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            blog_id: postId
          })
        
        setIsFavorite(true)
        toast.success('お気に入りに追加しました')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('エラーが発生しました')
    }
  }

  if (isLoading) {
    return <div className="w-6 h-6" />
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center space-x-1 transition-colors ${
        isFavorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } ${className || ''}`}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  )
}

export default FavoriteButton 