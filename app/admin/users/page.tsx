"use client"

import { useState } from "react"

export default function AdminUserUpdatePage() {
    const [uid, setUid] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [result, setResult] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleUpdate = async () => {
        setResult(null)
        if (!uid) {
        setResult("UIDは必須です")
        return
        }
        setLoading(true)
        try {
        // API Route経由でService Role Keyを使ってauth.usersを更新する
        const res = await fetch("/api/admin/update-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, email, phone }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "更新に失敗しました")
        setResult("更新に成功しました")
        } catch (e) {
        if (e instanceof Error) {
            setResult(e.message);
        } else {
            setResult("更新に失敗しました");
        }
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-6">管理者: ユーザー情報更新</h2>
        <div className="space-y-4">
            <div>
            <label className="block font-bold mb-1">UID（必須）</label>
            <input type="text" className="w-full border rounded px-2 py-1" value={uid} onChange={e => setUid(e.target.value)} required />
            </div>
            <div>
            <label className="block font-bold mb-1">Email（任意）</label>
            <input type="email" className="w-full border rounded px-2 py-1" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
            <label className="block font-bold mb-1">Phone（任意）</label>
            <input type="text" className="w-full border rounded px-2 py-1" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button onClick={handleUpdate} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded mt-4">
            {loading ? "更新中..." : "更新"}
            </button>
            {result && <div className="mt-4 text-center text-sm text-red-600">{result}</div>}
        </div>
        </div>
    )
    } 