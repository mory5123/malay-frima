"use client"

import { useRouter } from "next/navigation"

interface ClearSearchButtonProps {
  searchQuery: string
}

const ClearSearchButton = ({ searchQuery }: ClearSearchButtonProps) => {
  const router = useRouter()

  const handleClearSearch = () => {
    router.push("/")
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">
        「{searchQuery}」の検索結果
      </h2>
      <button 
        onClick={handleClearSearch}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        ← 検索をクリア
      </button>
    </div>
  )
}

export default ClearSearchButton 