import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
    const { uid, email, phone } = await req.json()
    if (!uid) {
        return NextResponse.json({ error: 'UIDは必須です' }, { status: 400 })
    }
    // Service Role Key（.env.localにSUPABASE_SERVICE_ROLE_KEYとして保存）
    console.log("data ",uid,email,phone)

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!serviceRoleKey || !supabaseUrl) {
        return NextResponse.json({ error: 'サーバー設定が不正です' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const updateObj: Record<string, string> = {}
    if (email) updateObj.email = email
    if (phone) updateObj.phone = phone
    if (Object.keys(updateObj).length === 0) {
        return NextResponse.json({ error: 'EmailまたはPhoneのいずれかを入力してください' }, { status: 400 })
    }
    // 管理者APIでauth.usersを更新
    const { data, error } = await supabase.auth.admin.updateUserById(uid, updateObj)
    if (error) {
        console.error("Supabase admin update error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
} 