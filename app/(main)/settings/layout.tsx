"use client"

import { usePathname } from "next/navigation"
import { UserRoundPen, Mail, KeyRound, Heart, ListOrdered, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

// ナビゲーション
const subNavigation = [
    {
        name: "プロフィール",
        icon: UserRoundPen,
        href: "/settings/profile",
    },
    {
        name: "メールアドレス変更",
        icon: Mail,
        href: "/settings/email",
    },
    {
        name: "パスワード変更",
        icon: KeyRound,
        href: "/settings/password",
    },
    {
        name: "電話番号認証",
        icon: Phone,
        href: "/settings/phone",
    },
    {
        name: "お気に入り",
        icon: Heart,   //       icon: Star,
        href: "/settings/favorites_list",
    },
    {
        name: "自分の出品一覧",
        icon: ListOrdered,   //or List 
        href: "/settings/listing",
    },
]

// レイアウト
const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    return (
        <div className="mx-auto max-w-screen-md">
            {/* スマホ画面（md未満）：ナビゲーションを上部に1行ずつ表示 */}
            <div className="md:hidden">
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {subNavigation.map((item, index) => (
                        <Button
                            asChild
                            key={index}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start font-bold py-2 px-3 min-w-0",
                                pathname === item.href && "bg-gray-100"
                            )}
                        >
                            <Link href={item.href} className="grid grid-cols-[auto,1fr] items-center text-xs whitespace-normal w-full min-w-0">
                                <item.icon className="w-4 h-4 mr-2" />
                                <span className="break-words w-full min-w-0 max-w-full truncate">{item.name}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
                {/* 中身を下部に表示 */}
                <div className="w-full">{children}</div>
            </div>

            {/* PC画面（md以上）：従来の左右レイアウト */}
            <div className="hidden md:grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-2">
                    {subNavigation.map((item, index) => (
                        <Button
                            asChild
                            key={index}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start font-bold py-1 px-2 sm:py-2 sm:px-4 min-w-0",
                                pathname === item.href && "bg-gray-100"
                            )}
                        >
                            <Link href={item.href} className="grid grid-cols-[auto,1fr] items-center text-xs sm:text-base whitespace-normal w-full min-w-0">
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                <span className="break-words w-full min-w-0 max-w-full truncate">{item.name}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
                <div className="col-span-2">{children}</div>
            </div>
        </div>
    )
}

export default SettingsLayout
