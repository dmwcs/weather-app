import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    }
    checkAuth();
  }, []);

  if (checking) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/login" />;
}
