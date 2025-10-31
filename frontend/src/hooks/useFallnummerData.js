import { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000";

/**
 * Custom hook to fetch fallnummer data from the backend API
 * @param {string} fallnummer - The fallnummer/case number to fetch
 * @returns {object} { data, loading, error }
 */
export function useFallnummerData(fallnummer) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fallnummer) {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/fallnummer/${fallnummer}`
        );
        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fallnummer]);

  return { data, loading, error };
}
