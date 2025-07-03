// actions/contact.ts
/*'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContact({
    title,
    content,
    sender_email,
    receiver_email,
    }: {
    title: string
    content: string
    sender_email: string
    receiver_email: string
    }) {
    if (!sender_email || !receiver_email) {
        return { error: 'メールアドレスが不正です' }
    }

    try {
        //console.log(title,content,sender_email,receiver_email)

        const result = await resend.emails.send({
        from: 'マレーフリマ <onboarding@resend.dev>', // 認証済みメールアドレスを使用
        to: receiver_email,
        subject: title,
        text: `お問い合わせ内容:\n\n${content}\n\n送信者: ${sender_email}`,   
        reply_to: sender_email, // 返信先を本人に設定
        })

        return { success: true, data: result }
    } catch (error) {
        console.error('メール送信エラー:', error)
        return { error: 'メール送信に失敗しました' }
    }
    }
*/


//  nodemailer 用以下は。
'use server'

import nodemailer from 'nodemailer'

export async function sendContact({
    title,
    content,
    sender_email,
    receiver_email,
}: {
    title: string
    content: string
    sender_email: string
    receiver_email: string
}) {
    if (!sender_email || !receiver_email) {
        return { error: 'メールアドレスが不正です' }
    }

    console.log(title,content,sender_email,receiver_email)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    const mailOptions = {
        from: `"マレーフリマ" <${process.env.EMAIL_USER}>`,
        to: receiver_email,
        subject: title,
        text: `お問い合わせ内容:\n\n${content}\n\n送信者: ${sender_email}`,
        replyTo: sender_email,
    }

    try {
        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (err) {
        console.error('メール送信エラー:', err)
        return { error: 'メール送信に失敗しました' }
    }
}
