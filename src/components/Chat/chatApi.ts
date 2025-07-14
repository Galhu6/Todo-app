const server = import.meta.env.VITE_SERVER_URL;
import { authFetch } from "../../utils/authFetch.js";

export const sendChatMessage = async (message: string) => {
    const res = await authFetch(`${server}/api/ai/chat`, {
        method: "POST",
        body: JSON.stringify({ message })
    });
    if (!res.ok) {
        throw new Error("Failed to send message");
    }
    return res.json() as Promise<{ reply: string }>;
};

export const fetchChatHistory = async () => {
    const res = await authFetch(`${server}/api/ai/chat`);
    if (!res.ok) {
        throw new Error("Failed to load chat history");
    }
    return res.json() as Promise<{ context: string }>;
}