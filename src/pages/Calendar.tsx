import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { eventService, Event } from '@/services/eventService';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { BackButton } from '@/components/BackButton';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getCalendarEvents(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      setEvents(response as Event[]);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  // Initial fetch and refresh on navigation or date change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, location.key]);

  // Add a refresh function that can be called manually
  const refreshCalendar = () => {
    fetchEvents();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (day: number | null) => {
    if (!day) return [];
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === targetDate.getFullYear() &&
        eventDate.getMonth() === targetDate.getMonth() &&
        eventDate.getDate() === targetDate.getDate()
      );
    }).sort((a, b) => {
      // Sort by time if on the same day
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      return timeA[1] - timeB[1];
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'conference': 'bg-blue-500',
      'workshop': 'bg-purple-500',
      'seminar': 'bg-green-500',
      'networking': 'bg-orange-500',
      'other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          {error}
        </div>
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
              <Link to="/calendar" className="text-blue-600 font-medium">Calendar</Link>
              {!isAuthenticated && (
                <Button asChild variant="outline">
                  <Link to="/login">Log in</Link>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {user?.role === 'organizer' && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/create-event">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshCalendar}
                className="flex items-center"
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">Event Calendar</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('day')}
            >
              Day
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    const isToday = day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();

                    return (
                      <div
                        key={index}
                        className={`min-h-24 p-1 border border-gray-200 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                          } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                      >
                        {day && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'
                              }`}>
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map(event => (
                                <Link
                                  key={event._id}
                                  to={isAuthenticated ? `/events/${event._id}` : "/login"}
                                  className={`block text-xs p-1 rounded text-white truncate ${getCategoryColor(event.category)}`}
                                  title={`${event.title}${!isAuthenticated ? ' - Log in to view details' : ''}`}
                                >
                                  {event.title}
                                </Link>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500 pl-1">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.slice(0, 4).map(event => (
                  <Link
                    key={event._id}
                    to={isAuthenticated ? `/events/${event._id}` : "/login"}
                    className="block border-l-4 border-blue-500 pl-3 hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-sm line-clamp-2">{event.title}</h4>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {format(new Date(event.date), 'MM/dd/yyyy')}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                  </Link>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to={isAuthenticated ? "/events" : "/login"}>
                    {isAuthenticated ? "View All Events" : "Log in to View All Events"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Categories Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['conference', 'workshop', 'seminar', 'networking', 'other'].map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded ${getCategoryColor(category)}`}></div>
                    <span className="text-sm capitalize">{category}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user?.role === 'organizer' && (
                    <Button className="w-full" asChild>
                      <Link to="/create-event">Create Event</Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
