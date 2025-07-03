"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchBox = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // searchパラメータが消えたらinputも空にする
    setSearchQuery(searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push("/")
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm">
      <Input
        type="text"
        placeholder="何をお探しですか？"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rounded-r-none"
      />
      <Button type="submit" className="rounded-l-none bg-blue-950">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}

export default SearchBox 