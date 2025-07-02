import { useState } from "react";
import { sendChatMessage } from "./chatApi.js";
import { useAppContext } from "../../context/AppContext.js";

interface Message {
    sender: "user" | "ai";
    text: string;
}

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const { refreshLists, refreshTasks } = useAppContext();

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { sender: "user", text: input };
        setMessages((msgs) => [...msgs, userMsg]);
        setInput("");
        try {
            const data = await sendChatMessage(userMsg.text);
            const aiMsg: Message = { sender: "ai", text: data.reply };
            setMessages((msgs) => [...msgs, aiMsg]);
            await refreshLists;
            refreshTasks();
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="mx-auto my-8 flex w-full max-w-2xl flex-col rounded bg-gray-800/50 p-4 shadow-lg">
            <div className="mb-4 max-h-80 flex-1 space-y-2 overflow-y-auto">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <span className={`rounded px-3 py- 2 text-sm ${m.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-100"}`}>
                            {m.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input className="flex-1 rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
                    placeholder="Ask the assistant..."
                    type="text" />
                <button className=" rounded px-4 py-2 bg-indigo-600 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};