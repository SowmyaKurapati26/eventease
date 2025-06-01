import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService, Event } from '@/services/eventService';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/BackButton';
import { ParticipantsModal } from '@/components/ParticipantsModal';
import { useToast } from '@/components/ui/use-toast';

const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status.toLowerCase()) {
        case 'upcoming':
            return 'default';
        case 'ongoing':
            return 'default';
        case 'completed':
            return 'secondary';
        case 'cancelled':
            return 'destructive';
        default:
            return 'default';
    }
};

const MyEvents = () => {
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
    const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<Event['attendees']>([]);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                if (!user) {
                    navigate('/login');
                    return;
                }
                const response = await eventService.getMyEvents();
                setCreatedEvents(response.created);
                setAttendingEvents(response.attending);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load your events');
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [user, navigate]);

    const handleDeleteEvent = async (eventId: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.deleteEvent(eventId);
                setCreatedEvents(createdEvents.filter(event => event._id !== eventId));
            } catch (err) {
                setError('Failed to delete event');
            }
        }
    };

    const formatEventDate = (dateString: string) => {
        return format(new Date(dateString), 'MMMM d, yyyy');
    };

    const filteredCreatedEvents = createdEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAttendingEvents = attendingEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewParticipants = async (event: Event) => {
        try {
            const attendees = await eventService.getEventAttendees(event._id);
            setParticipants(attendees);
            setSelectedEvent(event);
            setIsParticipantsModalOpen(true);
        } catch (error) {
            console.error('Error fetching participants:', error);
            toast({
                title: "Error",
                description: "Failed to load participants",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
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
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Events</h1>
                        <p className="text-lg text-gray-600">Manage your events</p>
                    </div>
                    {user?.role === 'organizer' && (
                        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700" asChild>
                            <Link to="/create-event">
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Event
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="mb-6">
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {user?.role === 'organizer' && createdEvents.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Events I'm Organizing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCreatedEvents.map((event) => (
                                <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                                                <p className="text-sm text-gray-600">{event.description}</p>
                                            </div>
                                            <Badge variant={getStatusVariant(event.status)}>{event.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <CalendarDays className="h-4 w-4 mr-2" />
                                                    {format(new Date(event.date), 'PPP')}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    {event.attendees?.length || 0} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} Attendees
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleViewParticipants(event)}
                                                    className="w-full"
                                                >
                                                    <Users className="h-4 w-4 mr-2" />
                                                    See Participants
                                                </Button>
                                                <Button variant="outline" asChild>
                                                    <Link to={`/edit-event/${event._id}`}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Event
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {attendingEvents.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Events I'm Attending</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAttendingEvents.map((event) => (
                                <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div>
                                            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                                            <p className="text-sm text-gray-600">{event.description}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                                                {formatEventDate(event.date)}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                                                {event.location}
                                                {event.locationType === 'online' && ' (Online)'}
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-2 text-blue-600" />
                                                {event.attendees.length} / {event.maxAttendees || '∞'} registered
                                            </div>
                                            <div className="flex items-center">
                                                <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                                                    {event.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {createdEvents.length === 0 && attendingEvents.length === 0 && (
                    <Card className="w-full max-w-md mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle>No Events Found</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="mb-4">You haven't created or joined any events yet.</p>
                            <Button asChild>
                                <Link to="/events">Browse Events</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {selectedEvent && (
                <ParticipantsModal
                    isOpen={isParticipantsModalOpen}
                    onClose={() => {
                        setIsParticipantsModalOpen(false);
                        setSelectedEvent(null);
                    }}
                    participants={participants}
                    eventTitle={selectedEvent.title}
                />
            )}
        </div>
    );
};

export default MyEvents; 
