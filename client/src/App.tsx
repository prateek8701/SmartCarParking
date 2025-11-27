import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { IoTProvider } from "@/context/IoTContext";
import { Navbar } from "@/components/layout/Navbar";
import Dashboard from "@/pages/Dashboard";
import Reservation from "@/pages/Reservation";
import Admin from "@/pages/Admin";
import ReservationReport from "@/pages/ReservationReport";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/not-found";

function Router({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      {isAuthenticated ? (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/reserve" component={Reservation} />
          <Route path="/report" component={ReservationReport} />
          <Route path="/admin" component={Admin} />
        </>
      ) : (
        <Route path="*" component={Login} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <QueryClientProvider client={queryClient}>
      <IoTProvider>
        <div className="min-h-screen bg-background text-foreground font-sans">
          {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
          <main>
            <Router isAuthenticated={isAuthenticated} />
          </main>
          <Toaster />
        </div>
      </IoTProvider>
    </QueryClientProvider>
  );
}

export default App;
