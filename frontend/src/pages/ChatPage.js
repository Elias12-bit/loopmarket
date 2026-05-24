import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.id;

  const sellerId = searchParams.get("sellerId");

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (user) {
      fetchConversations();

      if (sellerId) {
        openChatWithSeller(sellerId);
      }
    }
  }, [sellerId]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API}/chat/conversations/${currentUserId}`);
      setConversations(res.data);
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  };

  const openChatWithSeller = async (sellerId) => {
    try {
      const sellerRes = await axios.get(`${API}/users/${sellerId}`);
      setSelectedUser(sellerRes.data);

      const messagesRes = await axios.get(
        `${API}/chat/messages/${currentUserId}/${sellerId}`
      );

      setMessages(messagesRes.data);
    } catch (err) {
      console.error("Open seller chat error:", err);
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
      console.error("Fetch messages error:", err);
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
      console.error("Send message error:", err);
      alert("Failed to send message");
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <h1>Chat</h1>
          <p>You need to login or create an account to chat with sellers.</p>

          <div className="button-group" style={{ justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>

            <button className="btn-dark" onClick={() => navigate("/signup")}>
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* LEFT SIDE */}
      <div className="chat-sidebar">
        <div style={{ marginBottom: "20px" }}>
          <h2>Messages</h2>
          <p style={{ color: "#6b7280", marginTop: "-10px" }}>
            Your conversations with buyers and sellers
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="empty-state" style={{ padding: "25px" }}>
            <h3>No conversations yet</h3>
            <p>Open a product and click chat with seller.</p>
          </div>
        ) : (
          conversations.map((person) => (
            <div
              key={person.id}
              onClick={() => selectUser(person)}
              className="chat-user"
              style={{
                background:
                  selectedUser?.id === person.id ? "#fef3c7" : "#f9fafb",
                border:
                  selectedUser?.id === person.id
                    ? "1px solid #f59e0b"
                    : "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={person.image_url || "/images/default-user.png"}
                  alt="user"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#e5e7eb",
                  }}
                />

                <div>
                  <strong>{person.username || person.name || "User"}</strong>

                  <p
                    style={{
                      margin: "3px 0 0",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    {person.email || "No email"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="chat-main">
        {!selectedUser ? (
          <div
            style={{
              height: "100%",
              minHeight: "620px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <div>
              <h1>Start a Conversation</h1>
              <p style={{ color: "#6b7280" }}>
                Select a chat from the left side or open a product and chat with
                its seller.
              </p>

              <button className="btn-primary" onClick={() => navigate("/")}>
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="chat-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={selectedUser.image_url || "/images/default-user.png"}
                  alt="selected user"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#e5e7eb",
                  }}
                />

                <div>
                  <div>
                    Chat with{" "}
                    {selectedUser.username || selectedUser.name || "User"}
                  </div>

                  <small style={{ color: "#d1d5db" }}>
                    {selectedUser.email || "No email"}
                  </small>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="messages">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <h3>No messages yet</h3>
                  <p>Start the conversation by sending a message.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSent =
                    Number(msg.sender_id) === Number(currentUserId);

                  return (
                    <div
                      key={msg.id}
                      className={`message ${isSent ? "sent" : "received"}`}
                    >
                      {msg.message}
                    </div>
                  );
                })
              )}
            </div>

            {/* INPUT */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
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