import React, { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  Send,
  XCircle,
  Plus,
  Filter,
  ArrowLeftCircle,
} from "lucide-react";
import Modal from "../../shared/Modal";
import profile from "../../../assets/images/default-profile.jpg";
import "../styles/Inbox.css";

// Dummy data for demonstration
const mockMessages = [
  {
    id: 1,
    sender: "Fizy Edward",
    avatar: profile,
    email: "ritamaxwell002@gmail.com",
    topic: "Degree Cert",
    preview:
      "Can you please review the attached document and provide feedback by end of day?",
    body: "Dear reviewer, can you please review the attached document and provide feedback by end of day? Thank you.",
    date: "21st January, 2025",
    state: "unread",
  },
  {
    id: 2,
    sender: "ANC Charles",
    avatar: profile,
    email: "anc@gmail.com",
    topic: "WAEC Cert",
    preview:
      "Document review is pending: kindly provide an update on the status.",
    body: "Hello, the document review is still pending. Kindly update the status as soon as possible.",
    date: "3rd February, 2025",
    state: "unread",
  },
  {
    id: 3,
    sender: "Rita Ihuoma Maxwell",
    avatar: "/api/placeholder/32/32",
    email: "ritamaxwell002@gmail.com",
    topic: "Transcript",
    preview: "Please clarify the discrepancies in the document submitted.",
    body: "There are some discrepancies in the transcript you submitted. Please clarify the details as soon as possible.",
    date: "14th March, 2025",
    state: "read",
  },
  {
    id: 4,
    sender: "Rita Ihuoma Maxwell",
    avatar: "/api/placeholder/32/32",
    email: "ritamaxwell002@gmail.com",
    topic: "SOP",
    preview:
      "Following up on the document review; have you had a chance to look at it?",
    body: "Hi, just following up on the document review. Have you had a chance to look at it?",
    date: "27th April, 2025",
    state: "read",
  },
];

function Inbox() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [compose, setCompose] = useState({
    to: "",
    topic: "",
    body: "",
  });

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => setMessages(mockMessages), 500);
  }, []);

  const filtered = messages.filter(
    (msg) =>
      msg.sender.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.topic.toLowerCase().includes(search.toLowerCase()) ||
      msg.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this message?")) {
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMsg && selectedMsg.id === id) setShowReadModal(false);
    }
  };

  const handleOpenRead = (msg) => {
    setSelectedMsg(msg);
    setShowReadModal(true);
    // Mark as read
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, state: "read" } : m))
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    // In a real app, handle send logic here
    setShowSendModal(false);
    setCompose({ to: "", topic: "", body: "" });
    window.alert("Message sent!");
  };

  return (
    <div className="inbox-section">
      <div className="inbox-header-row">
        <div>
          <h1 className="inbox-title">Messages</h1>
          <span className="inbox-subtitle">Inbox</span>
        </div>
        <button className="btn primary" onClick={() => setShowSendModal(true)}>
          <Plus size={16} style={{ marginRight: 6 }} />
          New
        </button>
      </div>
      <div className="inbox-search-sort-row">
        <div className="search-bar">
          <Mail className="search-bar-icon" size={17} />
          <input
            className="search-bar-input"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn filter-btn">
          <Filter size={16} style={{ marginRight: 6 }} />
          Sort
        </button>
      </div>
      <div className="inbox-table-wrapper">
        <table className="inbox-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Email</th>
              <th>Topic</th>
              <th>Message Preview</th>
              <th>Date Received</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", color: "#607d8b" }}
                >
                  No messages found.
                </td>
              </tr>
            ) : (
              filtered.map((msg) => (
                <tr
                  key={msg.id}
                  className={msg.state === "unread" ? "unread" : ""}
                >
                  <td>
                    <span className="sender-cell">
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className="sender-avatar"
                      />
                      {msg.sender}
                    </span>
                  </td>
                  <td>{msg.email}</td>
                  <td>{msg.topic}</td>
                  <td>
                    <span
                      className="msg-preview"
                      onClick={() => handleOpenRead(msg)}
                      title="Click to read"
                    >
                      "{msg.preview}"
                    </span>
                  </td>
                  <td>{msg.date}</td>
                  <td>
                    <span className={`state-badge ${msg.state}`}>
                      <Mail size={16} />
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      title="Read"
                      onClick={() => handleOpenRead(msg)}
                    >
                      <Mail size={15} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="Delete"
                      onClick={() => handleDelete(msg.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Placeholder */}
      <div className="inbox-pagination-row">
        <span>
          Showing 1-{filtered.length} of {messages.length} Messages
        </span>
        <div className="pagination-controls">
          <button className="pagi-btn">&lt;</button>
          <button className="pagi-btn active">1</button>
          <button className="pagi-btn">2</button>
          <button className="pagi-btn">3</button>
          <button className="pagi-btn">&gt;</button>
        </div>
      </div>

      {/* Read Message Modal */}
      <Modal
        isOpen={showReadModal}
        onClose={() => setShowReadModal(false)}
        title={
          <span>
            <ArrowLeftCircle
              style={{ marginRight: 6, cursor: "pointer" }}
              onClick={() => setShowReadModal(false)}
              size={19}
            />
            Message
          </span>
        }
        size="md"
      >
        {selectedMsg && (
          <div className="read-modal-content">
            <div className="read-modal-top">
              <span className="sender-cell">
                <img
                  src={selectedMsg.avatar}
                  alt={selectedMsg.sender}
                  className="sender-avatar"
                />
                <b>{selectedMsg.sender}</b>
              </span>
              <span className="read-modal-date">{selectedMsg.date}</span>
            </div>
            <div className="read-modal-topic">
              <strong>Topic:</strong> {selectedMsg.topic}
            </div>
            <div className="read-modal-email">
              <strong>Email:</strong> {selectedMsg.email}
            </div>
            <div className="read-modal-body">{selectedMsg.body}</div>
            <div className="read-modal-actions">
              <button className="btn icon-btn">
                <Send size={16} /> Reply
              </button>
              <button className="btn icon-btn">
                <XCircle size={16} /> Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Compose Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="New Message"
        size="md"
      >
        <form className="compose-modal-form" onSubmit={handleSend}>
          <div className="input-group">
            <label>To</label>
            <input
              required
              value={compose.to}
              onChange={(e) => setCompose({ ...compose, to: e.target.value })}
              placeholder="Recipient email"
              type="email"
            />
          </div>
          <div className="input-group">
            <label>Topic</label>
            <input
              required
              value={compose.topic}
              onChange={(e) =>
                setCompose({ ...compose, topic: e.target.value })
              }
              placeholder="Message topic"
            />
          </div>
          <div className="input-group">
            <label>Message</label>
            <textarea
              required
              value={compose.body}
              onChange={(e) => setCompose({ ...compose, body: e.target.value })}
              placeholder="Type your message here"
              rows={5}
            />
          </div>
          <div className="compose-actions">
            <button className="btn primary" type="submit">
              <Send size={16} style={{ marginRight: 5 }} />
              Send
            </button>
            <button
              className="btn outline"
              type="button"
              onClick={() => setShowSendModal(false)}
            >
              <XCircle size={16} style={{ marginRight: 5 }} />
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Inbox;
