const server = import.meta.env.VITE_SERVER_URL;
import { authFetch } from "../../utils/authFetch.js";

export const sendChatMessage = async (message: string) => {
    const res = authFetch(`${server}/api/ai/chat`, {
        method: "POST",
        body: JSON.stringify({ message })
    });
    if (!res.ok) {
        throw new Error("Failed to send message");
    }
    return res.json() as Promise<{ reply: string }>;
};