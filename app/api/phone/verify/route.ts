import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID!
const client = twilio(accountSid, authToken)
// import { Vonage } from '@vonage/server-sdk'
// const vonageApiKey = process.env.VONAGE_API_KEY!
// const vonageApiSecret = process.env.VONAGE_API_SECRET!
// const vonage = new Vonage({
//   apiKey: vonageApiKey,
//   apiSecret: vonageApiSecret,
// });

export async function POST(req: NextRequest) {
    const { countryCode, phone, code } = await req.json()
    const to = `+${countryCode}${phone}`
    try {
        // const resp = await vonage.verify.check(requestId, code);
        // if (resp.status === '0') {
        //   return NextResponse.json({ success: true });
        // } else {
        //   const errorText = (resp as { errorText?: string }).errorText;
        //   return NextResponse.json({ error: errorText || '認証失敗' }, { status: 400 });
        // }
        const verificationCheck = await client.verify.v2.services(verifySid).verificationChecks.create({
          to,
          code,
        })
        if (verificationCheck.status === 'approved') {
          return NextResponse.json({ success: true })
        } else {
          return NextResponse.json({ error: '認証コードが正しくありません' }, { status: 400 })
        }
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
} 