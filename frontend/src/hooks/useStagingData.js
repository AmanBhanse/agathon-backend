import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config";

/**
 * Hook to fetch and process staging data from Excel
 * Returns counts for each staging variable across all cases
 */
export function useStagingData() {
  const [stagingData, setStagingData] = useState({
    "Staging clinic cT": {},
    "Staging Clinic N": {},
    "Staging Clinic M": {},
    "Staging Clinic UICC": {},
    "Staging Path pT": {},
    "Staging Path N": {},
    "Staging Path M": {},
    "Staging Path UICC": {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStagingData = async () => {
      try {
        setLoading(true);

        // Fetch all Fallnummers
        const response = await fetch(API_ENDPOINTS.getAllFallnummers);
        if (!response.ok) {
          throw new Error(`Failed to fetch Fallnummers: ${response.status}`);
        }

        const { fallnummers } = await response.json();

        // Initialize counters
        const stagingCounts = {
          "Staging clinic cT": {},
          "Staging Clinic N": {},
          "Staging Clinic M": {},
          "Staging Clinic UICC": {},
          "Staging Path pT": {},
          "Staging Path N": {},
          "Staging Path M": {},
          "Staging Path UICC": {},
        };

        // Fetch data for each Fallnummer and aggregate staging values
        for (const fallnummer of fallnummers) {
          try {
            const dataResponse = await fetch(
              API_ENDPOINTS.getFallnummer(fallnummer)
            );
            if (dataResponse.ok) {
              const { data } = await dataResponse.json();
              if (data) {
                // Count occurrences of each staging value
                Object.keys(stagingCounts).forEach((key) => {
                  const value = data[key];
                  if (value !== null && value !== undefined && value !== "") {
                    stagingCounts[key][value] =
                      (stagingCounts[key][value] || 0) + 1;
                  }
                });
              }
            }
          } catch (err) {
            console.warn(
              `Failed to fetch data for Fallnummer ${fallnummer}:`,
              err
            );
          }
        }

        setStagingData(stagingCounts);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching staging data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStagingData();
  }, []);

  return { stagingData, loading, error };
}
