/**
 * Application Configuration
 * Central place for API base URL and other configuration constants
 */

export const API_BASE_URL = "http://127.0.0.1:8000";

// API Endpoints
export const API_ENDPOINTS = {
  // Fallnummer/Case Data
  getFallnummer: (fallnummer) =>
    `${API_BASE_URL}/api/v1/fallnummer/${fallnummer}`,
  getAllFallnummers: `${API_BASE_URL}/api/v1/excel/fallnummers`,

  // Combined Report
  getCombinedReport: `${API_BASE_URL}/api/v1/getCombinedReport`,

  // RAG (Retrieval-Augmented Generation)
  queryRAG: `${API_BASE_URL}/api/v1/queryRAG`,
  indexPDF: `${API_BASE_URL}/api/v1/indexPDF`,
  ragStatus: `${API_BASE_URL}/api/v1/ragStatus`,
  embeddingsInfo: `${API_BASE_URL}/api/v1/embeddingsInfo`,
  deleteEmbeddings: `${API_BASE_URL}/api/v1/embeddings`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
