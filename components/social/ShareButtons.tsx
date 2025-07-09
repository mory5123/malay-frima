"use client"

import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
}

const ShareButtons = ({ title, url, description }: ShareButtonsProps) => {
  const shareText = description ? `${title} - ${description}` : title

  const handleShare = async (platform: "facebook" | "twitter" | "instagram") => {
    // 優先: Web Share API (モバイル対応)
    if (navigator.share && platform !== "instagram") {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        })
        toast.success(`${platform === "facebook" ? "Facebook" : "Twitter"}でシェアしました`)
        return
      } catch {
        toast.error("シェアがキャンセルされました")
        return
      }
    }

    // fallback
    if (platform === "facebook") {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`
      window.open(fbUrl, '_blank', 'width=600,height=400')
      toast.success("Facebookでシェアしました")
    }

    if (platform === "twitter") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
      window.open(twitterUrl, '_blank', 'width=600,height=400')
      toast.success("Twitterでシェアしました")
    }

    if (platform === "instagram") {
      const textToCopy = `${title}\n\n${description || ""}\n\n${url}`
      navigator.clipboard.writeText(textToCopy).then(() => {
        toast.success("Instagram用テキストをコピーしました。Instagramアプリで貼り付けてください。")
      }).catch(() => {
        toast.error("コピーに失敗しました")
      })
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">この投稿をシェア</h3>
      <div className="flex space-x-3">
        {/* Twitter */}
        <Button
          onClick={() => handleShare("twitter")}
          className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white"
        >
          <FaTwitter className="h-4 w-4" />
          <span>Twitter</span>
        </Button>

        {/* Facebook */}
        <Button
          onClick={() => handleShare("facebook")}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FaFacebook className="h-4 w-4" />
          <span>Facebook</span>
        </Button>

        {/* Instagram */}
        <Button
          onClick={() => handleShare("instagram")}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <FaInstagram className="h-4 w-4" />
          <span>Instagram</span>
        </Button>
      </div>
    </div>
  )
}

export default ShareButtons
