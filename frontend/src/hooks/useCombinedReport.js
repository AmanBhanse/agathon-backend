import { useState, useEffect } from "react";
import { useCaseStore } from "../store";
import { API_ENDPOINTS } from "../config";

/**
 * Custom hook to fetch combined clinical report from the backend AI
 * @param {string} fallnummer - The fallnummer/case number
 * @param {object} caseData - The patient case data
 * @param {boolean} forceRefresh - Force refresh bypassing cache
 * @returns {object} { report, loading, error, isCached }
 */
export function useCombinedReport(fallnummer, caseData, forceRefresh = false) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  // Get cache methods from store
  const cachedReports = useCaseStore((state) => state.cachedReports);
  const setCachedReport = useCaseStore((state) => state.setCachedReport);

  useEffect(() => {
    if (!fallnummer || !caseData || Object.keys(caseData).length === 0) {
      setReport(null);
      setError(null);
      setIsCached(false);
      return;
    }

    const fetchReport = async () => {
      // Check cache first if not forcing refresh
      if (!forceRefresh && cachedReports[fallnummer]) {
        setReport(cachedReports[fallnummer].report);
        setIsCached(true);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setIsCached(false);
      try {
        const response = await fetch(API_ENDPOINTS.getCombinedReport, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fallnummer,
            data: caseData,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const jsonData = await response.json();
        setReport(jsonData);
        // Store in cache
        setCachedReport(fallnummer, jsonData);
      } catch (err) {
        setError(err.message || "Failed to generate report");
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [fallnummer, caseData, forceRefresh, cachedReports, setCachedReport]);

  return { report, loading, error, isCached };
}
