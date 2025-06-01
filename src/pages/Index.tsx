import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, MapPin, Clock, ArrowRight ,Search,ShieldCheck} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

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
      icon: Search,
      title: "Event Filtering",
      description: "Quickly find events using built-in search and filter options"
    },
    {
      icon: ShieldCheck,
      title: "Secure Access",
      description: "Role-based access control and secure authentication with JWT"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />

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
            {!isAuthenticated ? (
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg" asChild>
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : user?.role === 'organizer' && (
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg" asChild>
                <Link to="/create-event">
                  Create Event
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
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

      {/* CTA Section */}
      {!isAuthenticated && (
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
      )}

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
                {isAuthenticated && user?.role === 'organizer' && (
                  <li><Link to="/create-event" className="hover:text-white transition-colors">Create Event</Link></li>
                )}
                <li><Link to="/calendar" className="hover:text-white transition-colors">Calendar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
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
            <p>&copy; 2025 Event Ease. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
