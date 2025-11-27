import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { IoTProvider } from "@/context/IoTContext";
import { Navbar } from "@/components/layout/Navbar";
import Dashboard from "@/pages/Dashboard";
import Reservation from "@/pages/Reservation";
import Admin from "@/pages/Admin";
import ReservationReport from "@/pages/ReservationReport";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/reserve" component={Reservation} />
      <Route path="/report" component={ReservationReport} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IoTProvider>
        <div className="min-h-screen bg-background text-foreground font-sans">
          <Navbar />
          <main>
            <Router />
          </main>
          <Toaster />
        </div>
      </IoTProvider>
    </QueryClientProvider>
  );
}

export default App;
