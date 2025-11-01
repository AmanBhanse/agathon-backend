import { useState, useCallback } from "react";

/**
 * Custom hook for querying the RAG system
 * Handles API communication with the backend RAG endpoint
 *
 * @param {number} initialTopK - Initial number of relevant chunks to retrieve
 * @returns {Object} - { answer, relevantChunks, loading, error, query, setTopK, setTemperature }
 */
export function useRAGQuery(initialTopK = 3) {
  const [answer, setAnswer] = useState("");
  const [relevantChunks, setRelevantChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topK, setTopK] = useState(initialTopK);
  const [temperature, setTemperature] = useState(0.3);

  const query = useCallback(
    async (question) => {
      if (!question || question.trim() === "") {
        setError("Please enter a question");
        return;
      }

      setLoading(true);
      setError(null);
      setAnswer("");
      setRelevantChunks([]);

      try {
        // Try localhost:8000 first (standard dev port), then 8888 if needed
        const apiUrl = "http://localhost:8000/api/v1/queryRAG";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            model: "gpt-4o-mini",
            temperature: temperature,
            top_k: topK,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error: ${response.statusText}`);
        }

        const data = await response.json();
        setAnswer(data.answer);
        setRelevantChunks(data.relevant_chunks || []);
      } catch (err) {
        setError(
          err.message ||
            "Failed to query RAG system. Make sure the backend is running on http://localhost:8000"
        );
        console.error("RAG query error:", err);
      } finally {
        setLoading(false);
      }
    },
    [topK, temperature]
  );

  return {
    answer,
    relevantChunks,
    loading,
    error,
    query,
    setTopK,
    setTemperature,
  };
}
