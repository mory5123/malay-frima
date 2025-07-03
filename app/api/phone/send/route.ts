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
    const { countryCode, phone } = await req.json()
    const to = `+${countryCode}${phone}`
    try {
        // const resp = await vonage.verify.start({
        //   number: to,
        //   brand: 'Vonage認証'
        // });
        // return NextResponse.json({ success: true, requestId: resp.request_id });
        console.log('Twilio Verify API送信内容:', { to, verifySid, channel: 'sms' });
        await client.verify.v2.services(verifySid).verifications.create({
          to,
          channel: 'sms',
        })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
    }
} 