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
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-2">
                    {subNavigation.map((item, index) => (
                        <Button
                            asChild
                            key={index}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start font-bold py-1 px-2 sm:py-2 sm:px-4",
                                pathname === item.href && "bg-gray-100"
                            )}
                        >
                            <Link href={item.href} className="flex items-center text-xs sm:text-base whitespace-nowrap">
                                <item.icon className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                {item.name}
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
