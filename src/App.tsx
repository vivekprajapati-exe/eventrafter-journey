
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { EventProvider } from "@/context/EventContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import EventList from "@/pages/EventList";
import EventDetail from "@/pages/EventDetail";
import EventCreate from "@/pages/EventCreate";
import EventEdit from "@/pages/EventEdit";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PrivateRoute from "@/components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/events/:eventId" element={<EventDetail />} />
                <Route path="/events/create" element={<EventCreate />} />
                <Route path="/events/:eventId/edit" element={<EventEdit />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>
            </Route>
            
            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
