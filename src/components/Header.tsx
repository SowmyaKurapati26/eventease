import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">Event Ease</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/events" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Events
                        </Link>
                        <Link to="/calendar" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Calendar
                        </Link>
                        {isAuthenticated && user?.role === 'organizer' && (
                            <Link to="/create-event" className="text-gray-600 hover:text-blue-600 transition-colors">
                                Create Event
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600">Welcome, {user.firstName}!</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {user.firstName[0]}
                                                    {user.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Link to="/profile">Profile</Link>
                                        </DropdownMenuItem>
                                        {user.role === 'organizer' && (
                                            <DropdownMenuItem>
                                                <Link to="/my-events">My Events</Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={handleLogout}>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}; 