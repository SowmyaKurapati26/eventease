
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const featuredEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM",
      location: "San Francisco Convention Center",
      attendees: 250,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Creative Design Workshop",
      date: "March 20, 2024",
      time: "2:00 PM", 
      location: "Design Studio Downtown",
      attendees: 45,
      image: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Networking Happy Hour",
      date: "March 22, 2024",
      time: "6:00 PM",
      location: "Rooftop Bar & Lounge",
      attendees: 120,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop"
    }
  ];

  const features = [
    {
      icon: CalendarDays,
      title: "Smart Calendar",
      description: "Intuitive calendar interface to view and manage all your events in one place"
    },
    {
      icon: Users,
      title: "Easy Registration",
      description: "Seamless event registration process for both organizers and participants"
    },
    {
      icon: MapPin,
      title: "Location Integration",
      description: "Integrated maps and location services for easy venue discovery"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications about event changes and reminders"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Event Ease</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/events" className="text-gray-600 hover:text-blue-600 transition-colors">Events</Link>
              <Link to="/calendar" className="text-gray-600 hover:text-blue-600 transition-colors">Calendar</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simplify Your
            <span className="text-blue-600 block">Event Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, discover, and manage events effortlessly. Whether you're an organizer or participant, 
            Event Ease makes event management simple and enjoyable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg" asChild>
              <Link to="/create-event">
                Create Event
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Event Ease?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern technology and user experience in mind
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-lg text-gray-600">
              Discover amazing events happening near you
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-orange-500"></div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees} attendees
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of organizers and participants using Event Ease
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3 text-lg" asChild>
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CalendarDays className="h-6 w-6" />
                <span className="text-xl font-bold">Event Ease</span>
              </div>
              <p className="text-gray-400">
                Making event management simple and enjoyable for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
                <li><Link to="/create-event" className="hover:text-white transition-colors">Create Event</Link></li>
                <li><Link to="/calendar" className="hover:text-white transition-colors">Calendar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Event Ease. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
