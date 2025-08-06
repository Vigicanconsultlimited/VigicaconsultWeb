import React, { useState } from "react";
import {
  Mail,
  Trash2,
  ArrowLeftCircle,
  Send,
  XCircle,
  Users,
  UserPlus,
} from "lucide-react";
import profile from "../../../assets/images/default-profile.jpg";
import Modal from "../../shared/Modal";
import "../styles/Inbox.css";

const mockSent = [
  {
    id: 1,
    to: "admissions@university.com",
    recipient: "Admissions Office",
    avatar: profile,
    topic: "Application Submission",
    preview: "I have submitted all required documents for my application.",
    body: "Hello,\n\nI have submitted all required documents for my application. Kindly confirm receipt.\n\nBest regards,\nRita",
    date: "22nd July, 2025",
    state: "sent",
  },
  {
    id: 2,
    to: "fizy@gmail.com",
    recipient: "Fizy Edward",
    avatar: profile,
    topic: "Reference Request",
    preview: "Could you please provide a reference letter for my application?",
    body: "Hi Fizy,\n\nCould you please provide a reference letter for my university application?\n\nThanks,\nRita",
    date: "20th July, 2025",
    state: "sent",
  },
  {
    id: 3,
    to: "info@embassy.com",
    recipient: "Visa Office",
    avatar: "/api/placeholder/32/32",
    topic: "Visa Inquiry",
    preview: "I would like to inquire about the status of my student visa.",
    body: "Dear Visa Office,\n\nI would like to inquire about the status of my student visa application.\n\nThank you,\nRita",
    date: "16th July, 2025",
    state: "sent",
  },
];

export default function SentMessages() {
  const [messages, setMessages] = useState(mockSent);
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showReadModal, setShowReadModal] = useState(false);

  // Modal for sending message
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const filtered = messages.filter(
    (msg) =>
      msg.recipient.toLowerCase().includes(search.toLowerCase()) ||
      msg.to.toLowerCase().includes(search.toLowerCase()) ||
      msg.topic.toLowerCase().includes(search.toLowerCase()) ||
      msg.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this sent message?")) {
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMsg && selectedMsg.id === id) setShowReadModal(false);
    }
  };

  const handleOpenRead = (msg) => {
    setSelectedMsg(msg);
    setShowReadModal(true);
  };

  const handleOpenSendModal = (all = false) => {
    setSendToAll(all);
    setRecipient("");
    setSubject("");
    setBody("");
    setShowSendModal(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    // For demonstration, just add to mockSent
    setMessages([
      {
        id: messages.length + 1,
        to: sendToAll ? "All Students" : recipient,
        recipient: sendToAll ? "All Students" : recipient,
        avatar: "/api/placeholder/32/32",
        topic: subject,
        preview: body.slice(0, 60),
        body: body,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        state: "sent",
      },
      ...messages,
    ]);
    setShowSendModal(false);
  };

  return (
    <div className="inbox-section">
      <div className="inbox-header-row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="inbox-title">Messages</h1>
          <span className="inbox-subtitle">Sent</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.55rem" }}>
          <button
            className="btn outline"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            onClick={() => handleOpenSendModal(false)}
            title="Send to a particular student"
          >
            <UserPlus size={17} />
            New Message
          </button>
          <button
            className="btn outline"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            onClick={() => handleOpenSendModal(true)}
            title="Send to all students"
          >
            <Users size={17} />
            Message All
          </button>
        </div>
      </div>
      <div className="inbox-search-sort-row">
        <div className="search-bar">
          <Mail className="search-bar-icon" size={17} />
          <input
            className="search-bar-input"
            placeholder="Search sent messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="inbox-table-wrapper">
        <table className="inbox-table">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Email</th>
              <th>Topic</th>
              <th>Message Preview</th>
              <th>Date Sent</th>
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
                  No sent messages found.
                </td>
              </tr>
            ) : (
              filtered.map((msg) => (
                <tr key={msg.id}>
                  <td>
                    <span className="sender-cell">
                      <img
                        src={msg.avatar}
                        alt={msg.recipient}
                        className="sender-avatar"
                      />
                      {msg.recipient}
                    </span>
                  </td>
                  <td>{msg.to}</td>
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
                    <span className="state-badge sent">
                      <Send size={16} />
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
          Showing 1-{filtered.length} of {messages.length} Sent Messages
        </span>
        <div className="pagination-controls">
          <button className="pagi-btn">&lt;</button>
          <button className="pagi-btn active">1</button>
          <button className="pagi-btn">2</button>
          <button className="pagi-btn">3</button>
          <button className="pagi-btn">&gt;</button>
        </div>
      </div>

      {/* Send Message Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title={
          <span>
            {sendToAll ? (
              <Users size={18} style={{ marginRight: 4 }} />
            ) : (
              <UserPlus size={18} style={{ marginRight: 4 }} />
            )}
            Send Message
          </span>
        }
        size="md"
      >
        <form
          onSubmit={handleSend}
          style={{ display: "flex", flexDirection: "column", gap: 15 }}
        >
          {!sendToAll && (
            <div>
              <label>Recipient Email</label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                placeholder="Enter student's email"
                className="input"
              />
            </div>
          )}
          <div>
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Message subject"
              className="input"
            />
          </div>
          <div>
            <label>Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Type your message here..."
              className="input"
              rows={5}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn outline"
              onClick={() => setShowSendModal(false)}
            >
              <XCircle size={16} style={{ marginRight: 5 }} />
              Cancel
            </button>
            <button type="submit" className="btn">
              <Send size={16} style={{ marginRight: 5 }} />
              Send
            </button>
          </div>
        </form>
      </Modal>

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
            Sent Message
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
                  alt={selectedMsg.recipient}
                  className="sender-avatar"
                />
                <b>{selectedMsg.recipient}</b>
              </span>
              <span className="read-modal-date">{selectedMsg.date}</span>
            </div>
            <div className="read-modal-topic">
              <strong>Topic:</strong> {selectedMsg.topic}
            </div>
            <div className="read-modal-email">
              <strong>Email:</strong> {selectedMsg.to}
            </div>
            <div className="read-modal-body">{selectedMsg.body}</div>
            <div className="read-modal-actions">
              <button
                className="btn outline"
                onClick={() => setShowReadModal(false)}
              >
                <XCircle size={16} style={{ marginRight: 5 }} />
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
