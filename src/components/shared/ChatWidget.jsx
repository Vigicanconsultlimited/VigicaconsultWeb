import { useState, useRef, useEffect, useCallback } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import chatbotApi from "../../utils/chatbotApi";
import "./ChatWidget.css";

const QUICK_REPLIES = [
  "Leeds Beckett University",
  "De Montfort University",
  "Robert Gordon University",
  "Compare universities",
  "Visa requirements",
  "Book a consultation",
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Start a new chat session when widget opens
  const startNewSession = async () => {
    try {
      setIsLoading(true);
      const data = await chatbotApi.startChat();
      setSessionId(data.session_id);
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: data.message.content,
        },
      ]);
      setShowQuickReplies(true);
    } catch (error) {
      console.error("Failed to start chat:", error);
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later or contact us at e.ugwoke@vigicaconsult.com.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat open/close
  const toggleChat = () => {
    if (!isOpen && messages.length === 0) {
      startNewSession();
    }
    setIsOpen(!isOpen);
  };

  // Send a message
  const sendMessage = async (messageText) => {
    const text = messageText || inputText.trim();
    if (!text || isLoading || !sessionId) return;

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setShowQuickReplies(false);
    setIsLoading(true);

    try {
      const data = await chatbotApi.sendMessage(sessionId, text);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message.content,
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "Sorry, I couldn't process your message. Please try again or contact us directly at e.ugwoke@vigicaconsult.com.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Handle quick reply click
  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format message content — render Markdown for assistant, plain text for user
  const formatMessage = (content, role) => {
    if (role === "assistant") {
      return (
        <ReactMarkdown
          components={{
            // Open links in new tab
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            // Keep paragraphs compact
            p: ({ children }) => <p className="chat-md-p">{children}</p>,
          }}
        >
          {content}
        </ReactMarkdown>
      );
    }
    // User messages: plain text with line breaks
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="chat-widget">
      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <FaRobot className="chat-header-icon" />
              <div>
                <h4>VIGICA AI Assistant</h4>
                <span className="chat-status">
                  <span className="status-dot"></span> Online
                </span>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                )}
                <div className={`message-bubble ${msg.role}`}>
                  {formatMessage(msg.content, msg.role)}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="chat-message assistant">
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="message-bubble assistant typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {showQuickReplies && !isLoading && messages.length > 0 && (
              <div className="quick-replies">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              maxLength={2000}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chat-fab ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <FaTimes /> : <FaCommentDots />}
      </button>
    </div>
  );
};

export default ChatWidget;
