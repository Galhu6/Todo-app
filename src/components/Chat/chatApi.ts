const server = import.meta.env.VITE_SERVER_URL;

export const sendChatMessage = async (message: string) => {
    const res = await fetch(`${server}/api/ai/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-User-ID": `${localStorage.getItem("userId")}`
        },
        credentials: "include",
        body: JSON.stringify({ message })
    });
    if (!res.ok) {
        throw new Error("Failed to send message");
    }
    return res.json() as Promise<{ reply: string }>;
};