export interface ProfileType {
    id: string
    name: string
    introduce: string | null
    avatar_url: string | null
    phone_number: string | null
    phone_verified: boolean
}

export interface BlogType {
    id: string
    title: string
    content: string
    user_id: string
    image_url: string | null
    image_urls?: string[]
    updated_at: string
    created_at: string
    location: string
    category: string
    price: string | null
}
