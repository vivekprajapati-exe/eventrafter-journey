
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "@/context/EventContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import EventList from "@/pages/EventList";
import EventDetail from "@/pages/EventDetail";
import EventCreate from "@/pages/EventCreate";
import EventEdit from "@/pages/EventEdit";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EventProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<EventList />} />
              <Route path="events/new" element={<EventCreate />} />
              <Route path="events/:eventId" element={<EventDetail />} />
              <Route path="events/:eventId/edit" element={<EventEdit />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
