// utils\supabase\server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// createClient 関数を async に変更
export async function createClient() {
    // cookies() の呼び出しを await する
    const cookieStore = await cookies() // ここに `await` を追加

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // getAll 関数は既に async になっているのでこのままでOK
                async getAll() {
                    return await cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}