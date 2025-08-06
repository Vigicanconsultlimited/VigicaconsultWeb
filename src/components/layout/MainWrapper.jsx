import { useEffect, useState } from "react";
import { setUser } from "../utils/auth";

const MainWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await setUser();
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
