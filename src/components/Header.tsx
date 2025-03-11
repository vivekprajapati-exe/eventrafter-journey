
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="font-bold text-xl">
            Event Manager
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {isAuthenticated ? (
            <>
              <nav className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4 mr-2" />
                    Events
                  </Button>
                </Link>
                <Link to="/calendar">
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                </Link>
                <Link to="/events/create">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </Link>
              </nav>
              <div className="flex items-center space-x-2">
                <span className="text-sm hidden md:inline-block">
                  {user?.username}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <nav className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
