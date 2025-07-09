"use client"

import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import ListingButton from "./ListingButton"
import SearchBox from "@/components/search/SearchBox"
import toast from 'react-hot-toast'
import { HelpCircle } from "lucide-react"

interface NavigationProps {
    user: User | null
}

// ナビゲーション
const Navigation = ({ user }: NavigationProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const handleLogout = async () => {
        
        /*if (!window.confirm("ログアウトしますが、宜しいですか？")) {
            return
        }*/

        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    //ListingButtonクリック時のハンドラ
    const handleListingClick = () => {
        if (!user) {
                toast.error('投稿するにはログインが必要です')
                //router.push('/login')
                
                /*toast.error('投稿するには会員登録・ログインが必要です', {
                duration: 3000,
                position: 'top-center',
                icon: '⚠️',
                style: {
                    background: '#ffffff',
                    color: '#ff9800',
                },*/
                /*style: {
                    background: 'fffffff',
                    color: '#c62828',
                },
                });*/
        }
    };

    // トップページかどうかを判定
    const isHomePage = pathname === "/" || pathname === "/page"

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
            <div className="mx-auto max-w-screen-lg px-2 py-2">
                {/* ワイド画面用のレイアウト */}
                <div>
                        <p className="text-gray-400 text-xs font-normal mt-1"> {/* 新しく追加する説明文 */}
                            マレーシアの日本人向けフリマサイト</p></div>
                            
                <div className="hidden md:flex items-center justify-between">
                    <Link href="/" className="font-bold text-2xl text-blue-950 flex items-center">
                        <Image src="/favicon.ico" alt="マレーシア・フリマのアイコン" width={39} height={39} className="mr-1"/>マレフリ
                    </Link>

                    {isHomePage && (
                        <div className="flex-1 mx-8">
                            <SearchBox />
                        </div>
                    )}
                    
                    <div className="text-sm font-bold">
                        {user ? (
                            <div className="flex items-center space-x-5">
                                <Link href="/about/#about" className="flex items-center text-xs text-gray-500 hover:underline mr-4">
                                    <HelpCircle className="w-4 h-4 mr-1" /> 初めての方へ
                                </Link>
                                <Link href="/blog/new" className="inline-block">
                                    <ListingButton />
                                </Link>
                                <Link href="/settings/profile">
                                    <div>マイページ</div>
                                </Link>
                                <div className="cursor-pointer" onClick={handleLogout}>
                                    <LogOut className="h-5 w-5" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-5">
                                <Link href="/about/#about" className="flex items-center text-xs text-gray-500 hover:underline mr-4">
                                    <HelpCircle className="w-4 h-4 mr-1" /> 初めての方へ
                                </Link>
                                <Link href="/login" className="inline-block" onClick={handleListingClick}>
                                    <ListingButton />
                                </Link>
                                <Link href="/login">ログイン</Link>
                                <Link href="/signup">会員登録</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* スマホ画面用のレイアウト */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="font-bold text-2xl text-blue-950 flex items-center">
                            <Image src="/favicon.ico" alt="マレーシア・フリマのアイコン" width={39} height={39} className="mr-1"/> マレフリ
                        </Link>

                        <div className="text-sm font-bold">
                            {user ? (
                                <div className="flex items-center space-x-5">
                                    <Link href="/about/#about" className="flex items-center text-xs text-gray-500 hover:underline mr-4">
                                        <HelpCircle className="w-4 h-4 mr-1" /> 初めての方へ
                                    </Link>
                                    <Link href="/blog/new" className="inline-block">
                                        <ListingButton />
                                    </Link>
                                    <Link href="/settings/profile">
                                        <div>マイページ</div>
                                    </Link>
                                    <div className="cursor-pointer" onClick={handleLogout}>
                                        <LogOut className="h-5 w-5" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-5">
                                    <Link href="/about/#about" className="flex items-center text-xs text-gray-500 hover:underline mr-4">
                                        <HelpCircle className="w-4 h-4 mr-1" /> 初めての方へ
                                    </Link>
                                    <Link href="/signup" className="inline-block" onClick={handleListingClick}>
                                        <ListingButton />
                                    </Link>
                                    <Link href="/login">ログイン</Link>
                                    <Link href="/signup">会員登録</Link>
                                </div>
                            )}
                        </div>
                    </div>
                    {isHomePage && (
                        <div className="flex justify-center">
                            <SearchBox />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navigation