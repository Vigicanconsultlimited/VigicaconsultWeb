import apiInstance from "../../utils/axios";

// PERSONAL INFO
export const getSavedPersonalInfo = async (userId) => {
  try {
    const response = await apiInstance.get(
      `StudentPersonalInfo/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching personal info:", error);
    throw error;
  }
};

// ACADEMIC DOCUMENTS
export const getSavedAcademicDocs = async (userId) => {
  try {
    const response = await apiInstance.get(
      `StudentAcademicDocuments/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching academic documents:", error);
    throw error;
  }
};

// SUPPORTING DOCUMENTS
export const getSavedSupportingDocs = async (userId) => {
  try {
    const response = await apiInstance.get(
      `StudentSupportingDocuments/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching supporting documents:", error);
    throw error;
  }
};

// INBOX MESSAGES
export const getUserInbox = async (userId) => {
  try {
    const response = await apiInstance.get(`UserInbox/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user inbox:", error);
    throw error;
  }
};

// INDIVIDUAL DOCUMENTS (for uploads)
export const getUploadedPassport = async (userId) => {
  return apiInstance.get(`PassportPhoto/user/${userId}`);
};

export const getUploadedCV = async (userId) => {
  return apiInstance.get(`CV/user/${userId}`);
};

export const getUploadedPersonalStatement = async (userId) => {
  return apiInstance.get(`PersonalStatement/user/${userId}`);
};

export const getUploadedReferenceLetter = async (userId) => {
  return apiInstance.get(`ReferenceLetter/user/${userId}`);
};

export const getUploadedID = async (userId) => {
  return apiInstance.get(`GovernmentID/user/${userId}`);
};

export const getUploadedTranscript = async (userId) => {
  return apiInstance.get(`Transcript/user/${userId}`);
};

export const getUploadedCertificate = async (userId) => {
  return apiInstance.get(`Certificate/user/${userId}`);
};
