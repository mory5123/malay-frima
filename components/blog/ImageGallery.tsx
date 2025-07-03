"use client"

import { useState, useCallback, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
    images: string[]
    alt?: string
}

const ImageGallery = ({ images, alt = "image" }: ImageGalleryProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    // 空の画像URLをフィルタリング
    const validImages = images && images.length > 0 ? images.filter(img => img && img.trim() !== "") : ["/noImage.png"]
    
    const openModal = (index: number) => {
        setCurrentIndex(index)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
        )
    }, [validImages.length])

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => 
            prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
        )
    }, [validImages.length])

    // タッチイベントハンドラー
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) {
            goToNext()
        }
        if (isRightSwipe) {
            goToPrevious()
        }

        setTouchStart(null)
        setTouchEnd(null)
    }

    // キーボードイベントハンドラー
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return

        switch (e.key) {
            case "Escape":
                closeModal()
                break
            case "ArrowLeft":
                goToPrevious()
                break
            case "ArrowRight":
                goToNext()
                break
        }
    }, [isOpen, goToPrevious, goToNext])

    // キーボードイベントリスナーを追加
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleKeyDown])

    if (!validImages || validImages.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                画像がありません
            </div>
        )
    }

    return (
        <>
            {/* サムネイル表示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {validImages.map((imageUrl, index) => (
                    <div key={index} className="relative cursor-pointer group">
                        <img
                            src={imageUrl}
                            alt={`${alt}-${index}`}
                            className="rounded object-cover w-full h-48 transition-transform duration-200 group-hover:scale-105"
                            onClick={() => openModal(index)}
                        />
                    </div>
                ))}
            </div>

            {/* モーダル */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* 閉じるボタン */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                            onClick={closeModal}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        {/* 前の画像ボタン */}
                        {validImages.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 z-10 text-white hover:bg-white/20"
                                onClick={goToPrevious}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                        )}

                        {/* 画像表示 */}
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            <img
                                src={validImages[currentIndex]}
                                alt={`${alt}-${currentIndex}`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        {/* 次の画像ボタン */}
                        {validImages.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 z-10 text-white hover:bg-white/20"
                                onClick={goToNext}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        )}

                        {/* 画像カウンター */}
                        {validImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                                {currentIndex + 1} / {validImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ImageGallery