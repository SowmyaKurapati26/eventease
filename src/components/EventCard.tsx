import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Users, TimerOff } from 'lucide-react';
import { Event } from '@/services/eventService';
import { getImageUrl } from '@/lib/utils';
import { format } from 'date-fns';

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const formattedDate = format(new Date(event.date), 'MMMM d, yyyy');
    const registeredCount = event.attendees?.length || 0;
    const maxAttendees = event.maxAttendees || 'Unlimited';
    const formattedDeadline = event.registrationDeadline
        ? format(new Date(event.registrationDeadline), 'MMMM d, yyyy')
        : null;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={getImageUrl(event.image)}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        console.error('Image failed to load:', {
                            originalSrc: event.image,
                            fullUrl: getImageUrl(event.image),
                            error: e
                        });
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-event.jpg';
                    }}
                />
                <Badge
                    className="absolute top-2 left-2"
                    variant={event.category === 'conference' ? 'default' : 'secondary'}
                >
                    {event.category}
                </Badge>
                {event.price > 0 && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                        ${event.price}
                    </Badge>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                            {registeredCount} / {maxAttendees}
                        </span>
                    </div>
                    {formattedDeadline && (
                        <div className="flex items-center gap-2">
                            <TimerOff className="h-4 w-4" />
                            <span>Register by {formattedDeadline}</span>
                        </div>
                    )}
                </div>
                <Link
                    to={`/events/${event._id}`}
                    className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                >
                    View Details →
                </Link>
            </div>
        </Card>
    );
};

export default EventCard; 