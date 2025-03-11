
import { Bell, Calendar, Menu, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">EventRafter</span>
          </Link>
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            <Link to="/events" className="text-sm font-medium hover:text-primary">Events</Link>
            <Link to="/calendar" className="text-sm font-medium hover:text-primary">Calendar</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px]"
            />
          </div>
          <Button size="sm" className="hidden sm:flex gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-t py-2">
          <div className="container flex flex-col space-y-2">
            <Link to="/" className="px-3 py-2 hover:bg-muted rounded-md">Dashboard</Link>
            <Link to="/events" className="px-3 py-2 hover:bg-muted rounded-md">Events</Link>
            <Link to="/calendar" className="px-3 py-2 hover:bg-muted rounded-md">Calendar</Link>
            <div className="pt-2">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
