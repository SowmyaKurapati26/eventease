import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { eventService, Event } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getImageUrl } from '@/lib/utils';

const EventDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (!id) return;
                const eventData = await eventService.getEvent(id);
                setEvent(eventData as Event);
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to fetch event details",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, toast]);

    const handleJoinEvent = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setJoining(true);
        try {
            await eventService.joinEvent(id!);
            toast({
                title: "Success",
                description: "Successfully joined the event!",
            });
            // Refresh event data
            const updatedEvent = await eventService.getEvent(id!);
            setEvent(updatedEvent as Event);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to join event",
                variant: "destructive",
            });
        } finally {
            setJoining(false);
        }
    };

    const handleLeaveEvent = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLeaving(true);
        try {
            await eventService.leaveEvent(id!);
            toast({
                title: "Success",
                description: "Successfully left the event!",
            });
            // Refresh event data
            const updatedEvent = await eventService.getEvent(id!);
            setEvent(updatedEvent as Event);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to leave event",
                variant: "destructive",
            });
        } finally {
            setLeaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!event) {
        return <div>Event not found</div>;
    }

    const isOrganizer = user?.id === event.organizer._id;
    const isAttending = event.attendees.some(attendee => attendee._id === user?.id);
    const isFullyBooked = event.maxAttendees && event.attendees.length >= event.maxAttendees;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Card>
                    <div className="relative h-[400px] w-full overflow-hidden">
                        <img
                            src={getImageUrl(event.image)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-event.jpg';
                            }}
                        />
                    </div>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                                <p className="text-gray-500">
                                    Organized by {event.organizer.firstName} {event.organizer.lastName}
                                </p>
                            </div>
                            <div className="space-x-4">
                                {!isOrganizer && !isAttending && (
                                    <Button
                                        onClick={handleJoinEvent}
                                        disabled={joining || isFullyBooked || event.status === 'completed'}
                                        className={event.status === 'completed' ? 'bg-gray-400' : ''}
                                    >
                                        {joining ? 'Joining...' :
                                            isFullyBooked ? 'Fully Booked' :
                                                event.status === 'completed' ? 'Event Completed' :
                                                    'Join Event'}
                                    </Button>
                                )}
                                {isOrganizer && (
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/events/${event._id}/edit`)}
                                    >
                                        Edit Event
                                    </Button>
                                )}
                                {isAttending && !isOrganizer && (
                                    <Button
                                        variant="destructive"
                                        onClick={handleLeaveEvent}
                                        disabled={leaving || event.status === 'completed'}
                                    >
                                        {leaving ? 'Leaving...' : 'Leave Event'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-5 w-5 text-gray-500" />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-gray-500" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-gray-500" />
                                            <span>
                                                {event.attendees.length} / {event.maxAttendees || 'Unlimited'} attendees
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-gray-500" />
                                            <span>${event.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Attendees</h3>
                                <div className="space-y-2">
                                    {event.attendees.map((attendee) => (
                                        <div
                                            key={attendee._id}
                                            className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                                        >
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                {attendee.firstName[0]}
                                                {attendee.lastName[0]}
                                            </div>
                                            <span>
                                                {attendee.firstName} {attendee.lastName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EventDetail; 