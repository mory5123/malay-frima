"use server"

import { BlogSchema } from "@/schemas"
import { createClient } from "@/utils/supabase/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { decode } from "base64-arraybuffer"

interface newBlogProps extends z.infer<typeof BlogSchema> {
    base64Images: string[]
    userId: string
}

// ブログ投稿
export const newBlog = async (values: newBlogProps) => {
    try {
        const supabase = await createClient()

        let image_url = ""
        const image_urls: string[] = []

        if (values.base64Images && values.base64Images.length > 0) {
            for (let i = 0; i < Math.min(values.base64Images.length, 3); i++) {
                const base64Image = values.base64Images[i]
                const matches = base64Image.match(/^data:(.+);base64,(.+)$/)
                if (!matches || matches.length !== 3) {
                    return { error: "無効な画像データです" }
                }
                const contentType = matches[1]
                const base64Data = matches[2]
                const fileExt = contentType.split("/")[1]
                const fileName = `${uuidv4()}.${fileExt}`
                const { error: storageError } = await supabase.storage
                    .from("blogs")
                    .upload(`${values.userId}/${fileName}`, decode(base64Data), {
                        contentType,
                    })
                if (storageError) {
                    return { error: storageError.message }
                }
                const { data: urlData } = await supabase.storage
                    .from("blogs")
                    .getPublicUrl(`${values.userId}/${fileName}`)
                image_urls.push(urlData.publicUrl)
            }
            image_url = image_urls[0] || ""
        }

        // ブログ新規作成
        const { error: insertError } = await supabase.from("blogs").insert({
            title: values.title,
            price: values.price ? Number(values.price) : null,
            content: values.content,
            image_url,
            image_urls,
            user_id: values.userId,
            location: values.location,
            category: values.category,
        })

        // エラーチェック
        if (insertError) {
            return { error: insertError.message }
        }
    } catch (err) {
        console.error(err)
        return { error: "エラーが発生しました" }
    }
}


interface editBlogProps extends z.infer<typeof BlogSchema> {
    blogId: string
    imageUrl: string | null
    base64Images: string[]
    userId: string
}

// ブログ編集
export const editBlog = async (values: editBlogProps) => {
    try {
        const supabase = await createClient()

        let image_url = values.imageUrl
        let image_urls: string[] = []

        // 現在の画像リストを処理
        if (values.base64Images && values.base64Images.length > 0) {
            const newImageUrls: string[] = []
            const existingImageUrls: string[] = []
            
            // 既存画像URLと新規画像を分類
            for (const imageData of values.base64Images) {
                if (imageData.startsWith("data:image")) {
                    // 新しくアップロードされた画像（base64形式）
                    const matches = imageData.match(/^data:(.+);base64,(.+)$/)

                    if (!matches || matches.length !== 3) {
                        return { error: "無効な画像データです" }
                    }

                    const contentType = matches[1]
                    const base64Data = matches[2]
                    const fileExt = contentType.split("/")[1]
                    const fileName = `${uuidv4()}.${fileExt}`

                    const { error: storageError } = await supabase.storage
                        .from("blogs")
                        .upload(`${values.userId}/${fileName}`, decode(base64Data), {
                            contentType,
                        })

                    if (storageError) {
                        return { error: storageError.message }
                    }

                    const { data: urlData } = await supabase.storage
                        .from("blogs")
                        .getPublicUrl(`${values.userId}/${fileName}`)
                    newImageUrls.push(urlData.publicUrl)
                } else if (imageData.startsWith("http")) {
                    // 既存の画像URL
                    existingImageUrls.push(imageData)
                }
            }
            
            // 既存画像URLと新規画像URLを組み合わせ
            image_urls = [...existingImageUrls, ...newImageUrls]
            image_url = image_urls[0] || ""
        } else {
            // 画像がない場合は既存の画像URLを保持
            const { data: existingBlog } = await supabase
                .from("blogs")
                .select("image_urls")
                .eq("id", values.blogId)
                .single()

            if (existingBlog?.image_urls && existingBlog.image_urls.length > 0) {
                image_urls = [...existingBlog.image_urls]
            }
        }

        console.log('Final image_urls:', image_urls)

        // ブログ編集
        const { error: updateError } = await supabase
            .from("blogs")
            .update({
                title: values.title,
                content: values.content,
                image_url,
                image_urls,
                location: values.location,
                category: values.category,
                price: values.price
            })
            .eq("id", values.blogId)

        // エラーチェック
        if (updateError) {
            return { error: updateError.message }
        }
    } catch (err) {
        console.error(err)
        return { error: "エラーが発生しました" }
    }
}

interface deleteBlogProps {
    blogId: string
    imageUrl: string | null
    imageUrls: string[] | null
    userId: string
}

// ブログ削除
export const deleteBlog = async ({
    blogId,
    imageUrl,
    imageUrls,
    userId,
}: deleteBlogProps) => {
    try {
        const supabase = await createClient()

        // ブログ削除
        const { error } = await supabase.from("blogs").delete().eq("id", blogId)

        if (error) {
            return { error: error.message }
        }

        // 画像ファイルの削除
        const filesToDelete: string[] = []

        // 単一画像の削除
        if (imageUrl) {
            const fileName = imageUrl.split("/").slice(-1)[0]
            filesToDelete.push(`${userId}/${fileName}`)
        }

        // 複数画像の削除
        if (imageUrls && imageUrls.length > 0) {
            imageUrls.forEach((url) => {
                if (url && url !== "/noImage.png") {
                    const fileName = url.split("/").slice(-1)[0]
                    filesToDelete.push(`${userId}/${fileName}`)
                }
            })
        }

        // 画像ファイルを一括削除
        if (filesToDelete.length > 0) {
            await supabase.storage.from("blogs").remove(filesToDelete)
        }
    } catch (err) {
        console.error(err)
        return { error: "エラーが発生しました" }
    }
}