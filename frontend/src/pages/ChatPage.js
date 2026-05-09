import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const currentUserId = 1; // ⚠️ replace later

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/conversations/${currentUserId}`
      );
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/messages/${currentUserId}/${userId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post("http://localhost:5000/messages", {
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        message: text,
      });

      setText("");
      fetchMessages(selectedUser.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", height: "80vh" }}>

      {/* 👥 LEFT SIDE - CONVERSATIONS */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Chats</h3>

        {conversations.map((user) => (
          <div
            key={user.id}
            onClick={() => selectUser(user)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{user.name}</strong>
          </div>
        ))}
      </div>

      {/* 💬 RIGHT SIDE - MESSAGES */}
      <div style={{ width: "70%", padding: "10px" }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.name}</h3>

            <div style={{ height: "60vh", overflowY: "auto" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    textAlign:
                      msg.sender_id === currentUserId ? "right" : "left",
                    margin: "10px",
                  }}
                >
                  <span
                    style={{
                      padding: "8px",
                      background:
                        msg.sender_id === currentUserId
                          ? "#DCF8C6"
                          : "#eee",
                      display: "inline-block",
                    }}
                  >
                    {msg.message}
                  </span>
                </div>
              ))}
            </div>

            {/* ✍️ INPUT */}
            <div>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a conversation</p>
        )}
      </div>

    </div>
  );
};

export default ChatPage;