import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const from = process.env.WHATAPP_FROM;

const client = twilio(accountSid || '', authToken || '');
export async function sendWhatsApp(to: string, body: string) {
    if (!accountSid || !authToken || !from) {
        throw new Error('Twilio credential missing');
    }
    const message = await client.messages.create({
        body,
        from: `whatsapp:${from}`,
        to: `whatsapp:${to}`
    });
    return message.sid;
}