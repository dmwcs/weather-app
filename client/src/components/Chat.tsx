import { useState } from "react";

interface Message {
  city: string;
  body: string;
  sender: string;
  timestamp: string;
}

interface ChatProps {
  messages: Message[];
  onSend: (body: string) => void;
}

export default function Chat({ messages, onSend }: ChatProps) {
  const [msgInput, setMsgInput] = useState("");

  function handleSend() {
    if (!msgInput.trim()) return;
    onSend(msgInput);
    setMsgInput("");
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Chat</h3>
      <div className="bg-gray-700 rounded-lg p-4 h-48 overflow-y-auto mb-3 flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="text-sm">
              <span className="text-blue-400 font-medium">{msg.sender}</span>
              <span className="text-gray-500 text-xs ml-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <p className="text-gray-200">{msg.body}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!msgInput.trim()}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
