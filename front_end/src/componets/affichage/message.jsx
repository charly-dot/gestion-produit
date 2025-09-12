import { useState } from "react";

export default function Discution() {
  const [messages, setMessages] = useState([
    { sender: "Alice", text: "Salut, comment ça va ?" },
    { sender: "Bob", text: "Ça va bien, merci ! Et toi ?" },
    { sender: "Alice", text: "Super ! Tu travailles sur le projet ?" },
    { sender: "Bob", text: "Oui, je viens de finir la partie UI." },
  ]);

  return (
    <div className="min-h-screen p-6 bg-cyan-500 flex flex-col items-center">
      <h1 className="text-center text-3xl underline text-gray-700 font-medium mb-6">
        MESSAGE
      </h1>

      <div className="w-full max-w-md h-[400px] bg-blue-50 border border-blue-300 rounded-lg shadow-lg flex flex-col p-4">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender === "Alice" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                  msg.sender === "Alice"
                    ? "bg-white text-gray-800 rounded-tl-none"
                    : "bg-blue-600 text-white rounded-tr-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 border border-blue-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
