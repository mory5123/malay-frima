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

  /*const isMobile = () => {
    if (typeof window === "undefined") return false
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }*/

// text は1回だけ定義すればOK。すでに上で定義してるので再定義不要。
const handleFacebookShare = async () => {
  const text = description ? `${title} - ${description}` : title;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`

  // モバイル判定
  const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // モバイルかつ Web Share API 対応 → Facebookアプリでの共有を狙う
  if (isMobile && typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      toast.success("Facebookでシェアしました（アプリ）");
      return;
    } catch (err) {
      console.error("Share error:", err)
      toast.error("シェアがキャンセルされました");
      return;
    }
  }

  // PC または非対応端末は fallback の Web共有画面へ
  window.open(shareUrl, '_blank', 'width=600,height=400');
  toast.success("Facebookでシェアしました");
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
