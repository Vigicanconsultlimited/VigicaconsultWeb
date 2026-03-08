import teamApiInstance from "./teamApi";

/**
 * Chatbot API functions for the VIGICA AI Assistant.
 * Connects to the Django teamAPI chatbot endpoints.
 */
export const chatbotApi = {
  /**
   * Start a new chat session.
   * @param {Object} visitorInfo - Optional visitor details
   * @param {string} visitorInfo.visitor_name
   * @param {string} visitorInfo.visitor_email
   * @param {string} visitorInfo.visitor_phone
   * @returns {{ session_id: string, message: { role: string, content: string } }}
   */
  startChat: async (visitorInfo = {}) => {
    const response = await teamApiInstance.post("chatbot/start/", visitorInfo);
    return response.data;
  },

  /**
   * Send a message and receive an AI response.
   * @param {string} sessionId - The chat session UUID
   * @param {string} message - The user's message
   * @returns {{ session_id: string, message: { role: string, content: string } }}
   */
  sendMessage: async (sessionId, message) => {
    const response = await teamApiInstance.post("chatbot/send/", {
      session_id: sessionId,
      message,
    });
    return response.data;
  },

  /**
   * Get chat history for a session.
   * @param {string} sessionId - The chat session UUID
   * @returns {{ session_id: string, messages: Array }}
   */
  getChatHistory: async (sessionId) => {
    const response = await teamApiInstance.get(`chatbot/history/${sessionId}/`);
    return response.data;
  },

  /**
   * End a chat session.
   * @param {string} sessionId - The chat session UUID
   */
  endChat: async (sessionId) => {
    const response = await teamApiInstance.post("chatbot/end/", {
      session_id: sessionId,
    });
    return response.data;
  },
};

export default chatbotApi;
