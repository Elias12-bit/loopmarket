import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.id;

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (user) {
      fetchConversations();

      if (location.state?.receiverId) {
        openChatWithSeller(location.state.receiverId);
      }
    }
  }, [location.state]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API}/chat/conversations/${currentUserId}`);
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openChatWithSeller = async (sellerId) => {
    try {
      const res = await axios.get(`${API}/users/${sellerId}`);

      setSelectedUser(res.data);

      const messagesRes = await axios.get(
        `${API}/chat/messages/${currentUserId}/${sellerId}`
      );

      setMessages(messagesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectUser = async (person) => {
    setSelectedUser(person);

    try {
      const res = await axios.get(
        `${API}/chat/messages/${currentUserId}/${person.id}`
      );

      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!selectedUser) return;

    try {
      await axios.post(`${API}/chat/messages`, {
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        message: text,
      });

      setText("");

      const res = await axios.get(
        `${API}/chat/messages/${currentUserId}/${selectedUser.id}`
      );

      setMessages(res.data);
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Chat</h2>
        <p>You need to login to chat with sellers.</p>

        <button onClick={() => navigate("/login")}>Login</button>

        <button
          onClick={() => navigate("/signup")}
          style={{ marginLeft: "10px" }}
        >
          Create New Account
        </button>
      </div>
    );
  }

  return (
    <div
      className="chat-page"
      style={{
        display: "flex",
        height: "80vh",
        padding: "20px",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ccc",
          paddingRight: "15px",
        }}
      >
        <h2>Chats</h2>

        {conversations.length === 0 ? (
          <p>No conversations yet</p>
        ) : (
          conversations.map((person) => (
            <div
              key={person.id}
              onClick={() => selectUser(person)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor:
                  selectedUser?.id === person.id ? "#f0f0f0" : "white",
              }}
            >
              <img
                src={
                  person.image ||
                  person.image_url ||
                  "/images/default-user.png"
                }
                alt="user"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <strong>{person.username || person.name}</strong>
            </div>
          ))
        )}
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          width: "70%",
          paddingLeft: "20px",
        }}
      >
        {!selectedUser ? (
          <div>
            <h2>Select a conversation</h2>
            <p>Choose someone from the left or chat with a seller.</p>
          </div>
        ) : (
          <>
            <h2>Chat with {selectedUser.username || selectedUser.name}</h2>

            <div
              style={{
                height: "60vh",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "15px",
              }}
            >
              {messages.length === 0 ? (
                <p>No messages yet. Start the conversation.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      textAlign:
                        msg.sender_id === currentUserId ? "right" : "left",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor:
                          msg.sender_id === currentUserId
                            ? "#DCF8C6"
                            : "#eee",
                      }}
                    >
                      {msg.message}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                }}
              />

              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;