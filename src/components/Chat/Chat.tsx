import { useState, useEffect } from "react";
import { sendChatMessage, fetchChatHistory } from "./chatApi.js";
import { useAppContext } from "../../context/AppContext.js";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
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
      await refreshLists();
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const parseContext = (context: string): Message[] => {
    return context
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        if (line.startsWith("User: ")) {
          return { sender: "user", text: line.slice(6) } as Message;
        }
        if (line.startsWith("AI: ")) {
          return { sender: "ai", text: line.slice(4) };
        }
        return null;
      })
      .filter(Boolean) as Message[];
  };

  useEffect(() => {
    if (open && messages.length !== 0) {
      fetchChatHistory()
        .then((data) => {
          const parsed = parseContext(data.context);
          if (parsed.length) setMessages(parsed);
        })
        .catch((err: any) => console.error(err));
    }
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-80 h-96 flex flex-col rounded shadow-lg bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center bg-indigo-600 text-white p-2 rounded-t">
            <span>Assistant</span>
            <button onClick={() => setOpen(false)} className="text-sm">
              X
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`rounded px-3 p y-2 text-sm ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-2">
            <input
              className="flex-1 rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask the assistant"
              type="text"
            />
            <button
              className="rounded px-4 py-2 bg-indigo-600 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-indigo-500"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-indigo-600 text-white px-4 py-2 shadow-lg"
        >
          Chat
        </button>
      )}
    </div>
  );
};
