
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Users, Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      description: "Join industry leaders for cutting-edge tech discussions and networking opportunities.",
      date: "March 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "San Francisco Convention Center",
      attendees: 250,
      category: "Technology",
      price: "Free",
      organizer: "Tech Community SF"
    },
    {
      id: 2,
      title: "Creative Design Workshop",
      description: "Hands-on workshop covering modern design principles and tools.",
      date: "March 20, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Design Studio Downtown",
      attendees: 45,
      category: "Design",
      price: "$75",
      organizer: "Creative Collective"
    },
    {
      id: 3,
      title: "Networking Happy Hour",
      description: "Connect with professionals from various industries in a relaxed setting.",
      date: "March 22, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Rooftop Bar & Lounge",
      attendees: 120,
      category: "Networking",
      price: "$25",
      organizer: "Business Network"
    },
    {
      id: 4,
      title: "Startup Pitch Competition",
      description: "Watch innovative startups pitch their ideas to a panel of investors.",
      date: "March 25, 2024",
      time: "7:00 PM - 10:00 PM",
      location: "Innovation Hub",
      attendees: 200,
      category: "Business",
      price: "Free",
      organizer: "Startup Accelerator"
    },
    {
      id: 5,
      title: "Photography Masterclass",
      description: "Learn advanced photography techniques from professional photographers.",
      date: "March 28, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Photo Studio Plus",
      attendees: 30,
      category: "Arts",
      price: "$150",
      organizer: "Photo Masters"
    },
    {
      id: 6,
      title: "AI & Machine Learning Conference",
      description: "Explore the latest developments in artificial intelligence and machine learning.",
      date: "April 2, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Tech Center",
      attendees: 300,
      category: "Technology",
      price: "$200",
      organizer: "AI Society"
    }
  ];

  const categories = ['all', 'Technology', 'Design', 'Networking', 'Business', 'Arts'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Event Ease</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/events" className="text-blue-600 font-medium">Events</Link>
              <Link to="/calendar" className="text-gray-600 hover:text-blue-600 transition-colors">Calendar</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
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
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                  {event.category}
                </Badge>
                <Badge className="absolute top-3 right-3 bg-orange-500">
                  {event.price}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    {event.attendees} registered
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-3">Organized by {event.organizer}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or explore different categories.</p>
            <Button asChild>
              <Link to="/create-event">Create Your Own Event</Link>
            </Button>
          </div>
        )}

        {/* Pagination would go here */}
        {filteredEvents.length > 0 && (
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
