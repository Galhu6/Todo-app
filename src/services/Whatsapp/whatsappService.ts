import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const from = `whatsapp:${process.env.WHATSAPP_FROM}`;

const client = twilio(accountSid || "", authToken || "");
export async function sendWhatsApp(recieverNumber: string, body: string) {
  if (!accountSid || !authToken || !process.env.WHATSAPP_FROM) {
    throw new Error("Twilio credential missing");
  }
  const to = `whatsapp:${recieverNumber}`;
  const message = await client.messages.create({
    body,
    from,
    to,
  });
  return message.sid;
}
