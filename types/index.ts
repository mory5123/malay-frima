export interface ProfileType {
    id: string
    name: string
    introduce: string | null
    avatar_url: string | null
    phone_number: string | null
    country_code: string | null
    phone_verified: boolean
}

export interface BlogType {
    id: string
    user_id: string
    title: string
    content: string
    image_url?: string | null
    image_urls?: string[] | null
    updated_at: string
    created_at: string
    location: string
    category: string
    price: string | null,
    payment: string | null,
    delivery: string | null, 
}

export interface BlogItemProps extends BlogType {
    name: string;
    avatar_url: string;
}