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
  const text = description ? `${title} - ${description}` : title

  const isMobile = () => {
    if (typeof window === "undefined") return false
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    if (isMobile()) {
      // モバイルは location.href で開く（Facebookアプリに飛びやすく）
      window.location.href = shareUrl
    } else {
      // PCは window.open（元の動作）
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
    toast.success('Facebookでシェアしました')
  }

  const handleTwitterShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
    toast.success('Twitterでシェアしました')
  }

  const handleInstagramShare = () => {
    const textToCopy = `${title}\n\n${description || ""}\n\n${url}`
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success('Instagram用のテキストをコピーしました。Instagramアプリで貼り付けてください。')
    }).catch(() => {
      toast.error('コピーに失敗しました')
    })
  }

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">この投稿をシェア</h3>
      <div className="flex space-x-3">
        {/* Twitterシェアボタン */}
        <Button
          onClick={handleTwitterShare}
          className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white"
        >
          <FaTwitter className="h-4 w-4" />
          <span>Twitter</span>
        </Button>

        {/* Facebookシェアボタン */}
        <Button
          onClick={handleFacebookShare}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FaFacebook className="h-4 w-4" />
          <span>Facebook</span>
        </Button>

        {/* Instagramシェアボタン */}
        <Button
          onClick={handleInstagramShare}
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
