import { createContext, useContext, useState, useEffect } from "react";
import { getBusinesses } from "./client";

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    getBusinesses()
      .then((biz) => {
        setBusinesses(biz);
        setBackendOnline(true);
        if (biz.length > 0) {
          setBusinessId(biz[0].id);
        }
      })
      .catch(() => {
        // Backend is unreachable
        setBusinesses([]);
        setBackendOnline(false);
      })
      .finally(() => setLoadingBusinesses(false));
  }, []);

  return (
    <BusinessContext.Provider value={{ businesses, businessId, setBusinessId, loadingBusinesses, backendOnline }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
