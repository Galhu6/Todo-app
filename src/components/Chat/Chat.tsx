import { useState } from "react";
import { sendChatMessage } from "./chatApi.js";

interface Message {
    sender: "user" | "ai";
    text: string;
}

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { sender: "user", text: input };
        setMessages((msgs) => [...msgs, userMsg]);
        setInput("");
        try {
            const data = await sendChatMessage(userMsg.text);
            const aiMsg: Message = { sender: "ai", text: data.reply };
            setMessages((msgs) => [...msgs, aiMsg]);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="flex flex-colh-full border rounded p-4">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((m, idx) => (
                    <div key={idx} className={m.sender === "user" ? "text-right" : "text-left"}>
                        <span className="inline-block bg-gray-200 px-2 py-1 rounded m-1">
                            {m.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input className="flex-1 border rounded p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the assistant..."
                    type="text" />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};