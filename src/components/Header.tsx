
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

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
              <div className="flex items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full aspect-square bg-primary/10 hover:bg-primary/20"
                    >
                      <User className="h-4 w-4 text-primary" />
                      <span className="sr-only">User Profile</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-background/90 backdrop-blur-md border-primary/10">
                    <SheetHeader className="text-left">
                      <SheetTitle className="text-primary">User Profile</SheetTitle>
                      <SheetDescription>
                        {user?.username || user?.email}
                      </SheetDescription>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <div className="flex flex-col gap-4 mt-4">
                      <Button 
                        onClick={() => logout()}
                        variant="outline"
                        className="w-full justify-start border-primary/20 hover:bg-primary/10"
                      >
                        Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
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
