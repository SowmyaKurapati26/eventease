import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { CalendarDays, Mail, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/BackButton';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl text-red-600">Not Authorized</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4">Please log in to view your profile.</p>
                        <Button asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <BackButton />
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/events" className="text-gray-600 hover:text-blue-600 transition-colors">Events</Link>
                            <Link to="/calendar" className="text-gray-600 hover:text-blue-600 transition-colors">Calendar</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <UserCircle className="h-8 w-8 text-blue-600" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    {user.email}
                                </p>
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                <p className="text-lg font-semibold capitalize text-gray-900">
                                    {user.role}
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="pt-6 border-t">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    {user.role === 'organizer' && (
                                        <Button className="w-full" asChild>
                                            <Link to="/my-events">View My Events</Link>
                                        </Button>
                                    )}
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link to="/events">Browse Events</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile; 