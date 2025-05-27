
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, MapPin, Clock, Users, DollarSign, Save, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxAttendees: '',
    price: '',
    isOnline: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event created:', formData);
    // Here you would typically send the data to your backend
  };

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
              <Link to="/events" className="text-gray-600 hover:text-blue-600 transition-colors">Events</Link>
              <Link to="/calendar" className="text-gray-600 hover:text-blue-600 transition-colors">Calendar</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link to="/events">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Event</h1>
            <p className="text-lg text-gray-600">Fill in the details below to create your event</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter event title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your event..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="arts">Arts & Culture</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="sports">Sports & Fitness</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Date & Time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="date">Event Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time *</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleInputChange('startTime', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time *</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleInputChange('endTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="eventType"
                          checked={!formData.isOnline}
                          onChange={() => handleInputChange('isOnline', false)}
                        />
                        <span>In-person</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="eventType"
                          checked={formData.isOnline}
                          onChange={() => handleInputChange('isOnline', true)}
                        />
                        <span>Online</span>
                      </label>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">
                        {formData.isOnline ? 'Meeting Link/Platform' : 'Venue Address'} *
                      </Label>
                      <Input
                        id="location"
                        placeholder={formData.isOnline ? "Zoom, Teams, etc." : "Enter venue address"}
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Additional Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxAttendees">Max Attendees</Label>
                        <Input
                          id="maxAttendees"
                          type="number"
                          placeholder="Unlimited"
                          value={formData.maxAttendees}
                          onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Ticket Price</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview/Actions Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Title:</strong>
                        <p className="text-gray-600">{formData.title || 'Not set'}</p>
                      </div>
                      <div>
                        <strong>Category:</strong>
                        <p className="text-gray-600">{formData.category || 'Not set'}</p>
                      </div>
                      <div>
                        <strong>Date:</strong>
                        <p className="text-gray-600">{formData.date || 'Not set'}</p>
                      </div>
                      <div>
                        <strong>Time:</strong>
                        <p className="text-gray-600">
                          {formData.startTime && formData.endTime 
                            ? `${formData.startTime} - ${formData.endTime}`
                            : 'Not set'
                          }
                        </p>
                      </div>
                      <div>
                        <strong>Type:</strong>
                        <p className="text-gray-600">{formData.isOnline ? 'Online' : 'In-person'}</p>
                      </div>
                      <div>
                        <strong>Price:</strong>
                        <p className="text-gray-600">{formData.price ? `$${formData.price}` : 'Free'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Success</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Write a clear, descriptive title</li>
                      <li>• Include key details in description</li>
                      <li>• Choose the right category</li>
                      <li>• Set appropriate pricing</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
