import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, MapPin, Clock, Users, DollarSign, Save, Eye, Image, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService, Event } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type EventCategory = 'conference' | 'workshop' | 'seminar' | 'networking' | 'other';
type LocationType = 'physical' | 'online';

interface EventFormData {
  title: string;
  description: string;
  category: EventCategory | '';
  date: string;
  time: string;
  location: string;
  locationType: LocationType;
  maxAttendees: string;
  price: string;
  isPrivate: boolean;
  status: 'upcoming';
  registrationDeadline: string;
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    locationType: 'physical',
    maxAttendees: '',
    price: '',
    isPrivate: false,
    status: 'upcoming',
    registrationDeadline: ''
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'organizer') {
      toast({
        title: "Unauthorized",
        description: "Please log in as an organizer to create events.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate, toast]);

  const handleInputChange = (field: keyof EventFormData, value: string | boolean) => {
    setEventFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const requiredFields: (keyof EventFormData)[] = ['title', 'description', 'category', 'date', 'time', 'location', 'locationType'];
    const missingFields = requiredFields.filter(field => !eventFormData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (!isAuthenticated) {
        throw new Error('Please log in to create an event');
      }

      const submitFormData = new FormData();

      // Format date and time for the backend
      const formattedDate = new Date(eventFormData.date);
      const [hours, minutes] = eventFormData.time.split(':').map(Number);
      formattedDate.setHours(hours, minutes);

      // Append all form fields with proper formatting
      submitFormData.append('title', eventFormData.title);
      submitFormData.append('description', eventFormData.description);
      submitFormData.append('category', eventFormData.category);
      submitFormData.append('date', formattedDate.toISOString());
      submitFormData.append('time', eventFormData.time);
      submitFormData.append('location', eventFormData.location);
      submitFormData.append('locationType', eventFormData.locationType);
      submitFormData.append('status', eventFormData.status);

      // Handle optional numeric fields
      if (eventFormData.maxAttendees) {
        submitFormData.append('maxAttendees', eventFormData.maxAttendees.toString());
      }
      submitFormData.append('price', eventFormData.price.toString() || '0');

      // Handle boolean and optional fields
      submitFormData.append('isPrivate', eventFormData.isPrivate.toString());
      if (eventFormData.registrationDeadline) {
        const deadline = new Date(eventFormData.registrationDeadline);
        submitFormData.append('registrationDeadline', deadline.toISOString());
      }

      // Append image if selected
      const imageInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (imageInput?.files?.length) {
        submitFormData.append('image', imageInput.files[0]);
      }

      // Log the form data for debugging
      console.log('Submitting form data:');
      for (const pair of submitFormData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await eventService.createEvent(submitFormData);
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      navigate('/events');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, show loading or redirect
  if (!isAuthenticated || user?.role !== 'organizer') {
    return null; // Component will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Event Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Event Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => {
                          setImagePreview(null);
                          const imageInput = document.querySelector<HTMLInputElement>('input[type="file"]');
                          if (imageInput) imageInput.value = '';
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-500">
                      Recommended size: 1200x600 pixels. Max size: 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={eventFormData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={eventFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={eventFormData.category}
                    onValueChange={(value) => handleInputChange('category', value as EventCategory)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventFormData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={eventFormData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={eventFormData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="locationType">Location Type *</Label>
                  <Select
                    value={eventFormData.locationType}
                    onValueChange={(value) => handleInputChange('locationType', value as LocationType)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      min="0"
                      value={eventFormData.maxAttendees}
                      onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={eventFormData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={eventFormData.registrationDeadline}
                    onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={eventFormData.isPrivate}
                    onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPrivate">Private Event</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" asChild>
                  <Link to="/events">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
