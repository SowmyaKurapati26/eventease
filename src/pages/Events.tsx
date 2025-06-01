import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Users, Search, Filter, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService, Event } from '@/services/eventService';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { BackButton } from '@/components/BackButton';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['all', 'conference', 'workshop', 'seminar', 'networking', 'other'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm || undefined
        });
        // Type assertion to specify the response structure
        const eventData = response as { events: Event[], totalPages: number, currentPage: number, total: number };
        setEvents(eventData.events);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategory, searchTerm]);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for events.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      await eventService.joinEvent(eventId);
      // Update the events list to reflect the new registration
      setEvents(events.map(event => {
        if (event._id === eventId) {
          return {
            ...event,
            attendees: [...event.attendees, {
              _id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            }]
          };
        }
        return event;
      }));

      toast({
        title: "Success!",
        description: "You have successfully registered for the event.",
      });
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: "Unable to register for the event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;

    try {
      await eventService.leaveEvent(eventId);
      // Update the events list to reflect the cancellation
      setEvents(events.map(event => {
        if (event._id === eventId) {
          return {
            ...event,
            attendees: event.attendees.filter(attendee => attendee._id !== user.id)
          };
        }
        return event;
      }));

      toast({
        title: "Success!",
        description: "You have successfully unregistered from the event.",
      });
    } catch (err) {
      toast({
        title: "Unregistration Failed",
        description: "Unable to unregister from the event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isUserRegistered = (event: Event) => {
    return user && event.attendees.some(attendee => attendee._id === user.id);
  };

  const getRegistrationButton = (event: Event) => {
    const registered = isUserRegistered(event);
    const isFull = event.maxAttendees !== null && event.attendees.length >= event.maxAttendees;
    const isOrganizer = user && event.organizer._id === user.id;
    const isCompleted = event.status === 'completed';

    if (isOrganizer) {
      return (
        <Button className="w-full" variant="outline" disabled>
          You are the organizer
        </Button>
      );
    }

    if (isCompleted) {
      return (
        <Button className="w-full" variant="secondary" disabled>
          Event Completed
        </Button>
      );
    }

    if (registered) {
      return (
        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={() => handleUnregister(event._id)}
          disabled={isCompleted}
        >
          Cancel Registration
        </Button>
      );
    }

    if (isFull) {
      return (
        <Button className="w-full" disabled>
          Event Full
        </Button>
      );
    }

    return (
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={() => handleRegister(event._id)}
      >
        Register Now
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/events" className="text-blue-600 font-medium">Events</Link>
              <Link to="/calendar" className="text-gray-600 hover:text-blue-600 transition-colors">Calendar</Link>
            </div>
            {user?.role === 'organizer' && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/create-event">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-lg text-gray-600">Find amazing events happening in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-12 text-red-600">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or explore different categories.</p>
              {user?.role === 'organizer' && (
                <Button asChild>
                  <Link to="/create-event">Create Your Own Event</Link>
                </Button>
              )}
            </div>
          ) : (
            events.map((event) => (
              <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  {event.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDays className="h-12 w-12 text-white opacity-50" />
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                    {event.category}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-orange-500">
                    ${event.price}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                      {format(new Date(event.date), 'MMMM d, yyyy')}
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
                  <div className="pt-4">
                    {getRegistrationButton(event)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination would go here */}
        {events.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="outline" className="bg-blue-600 text-white">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
