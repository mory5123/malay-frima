import "./globals.css"
import type { Metadata, Viewport } from "next"
import { M_PLUS_1 } from "next/font/google"
import { createClient } from "@/utils/supabase/server"
import Navigation from "@/components/navigation/Navigation"
import ToastProvider from "@/components/providers/ToastProvider"
import Link from "next/link"

const mPlus1 = M_PLUS_1({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "マレーシア・フリマ‐日本人向けフリマサイト",
  description: "マレーシアの日本人向けフリマサイト",
}

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
}

interface RootLayoutProps {
  children: React.ReactNode
}

// ルートレイアウト
const RootLayout = async ({ children }: RootLayoutProps) => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  return (
    <html lang="ja">
      <body className={mPlus1.className}>
        <ToastProvider />
        <div className="flex min-h-screen flex-col">
          <Navigation user={user} />
          
          {/* ヘッダーとの間隔を確保 */}
          <main className="flex-1 pt-[140px] md:pt-[100px]">{children}</main>

          <footer className="w-full border-t py-4 bg-gray-50 text-center text-sm">
            <nav className="flex justify-center gap-4 flex-wrap text-gray-600">
            <Link href="/about/#about" className="hover:underline">初めての方に</Link>
            <span className="text-gray-400">|</span>
            <Link href="/about/#flow" className="hover:underline">お取引の流れ</Link>
            <span className="text-gray-400">|</span>
            <Link href="/about/#privacy" className="hover:underline">プライバシーポリシー</Link>
            <span className="text-gray-400">|</span>
            <Link href="/about/#personal-info" className="hover:underline">個人情報の取扱いについて</Link>
            <span className="text-gray-400">|</span>
            <Link href="/about/#contact" className="hover:underline">サイト運営者・問い合わせ先</Link>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
