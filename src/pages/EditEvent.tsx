import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { eventService, Event } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CalendarDays, Image, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { Label } from '@/components/ui/label';

type LocationType = 'physical' | 'online';
type Category = 'conference' | 'workshop' | 'seminar' | 'networking' | 'other';

interface FormData {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    locationType: LocationType;
    category: Category;
    maxAttendees: string;
    price: string;
    isPrivate: boolean;
    registrationDeadline: string;
    image?: File;
}

const EditEvent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        locationType: 'physical',
        category: 'workshop',
        maxAttendees: '',
        price: '0',
        isPrivate: false,
        registrationDeadline: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (!id) return;
                const response = await eventService.getEvent(id);
                const eventData = response as Event;

                // Check if the user is the organizer
                if (eventData.organizer._id !== user?.id) {
                    toast({
                        title: "Unauthorized",
                        description: "You can only edit events that you've created.",
                        variant: "destructive"
                    });
                    navigate('/my-events');
                    return;
                }

                setEvent(eventData);
                setFormData({
                    title: eventData.title,
                    description: eventData.description,
                    date: eventData.date.split('T')[0], // Format date for input
                    time: eventData.time,
                    location: eventData.location,
                    locationType: eventData.locationType,
                    category: eventData.category,
                    maxAttendees: eventData.maxAttendees?.toString() || '',
                    price: eventData.price.toString(),
                    isPrivate: eventData.isPrivate,
                    registrationDeadline: eventData.registrationDeadline ?
                        eventData.registrationDeadline.split('T')[0] : '',
                });
                setLoading(false);
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to load event details.",
                    variant: "destructive"
                });
                navigate('/my-events');
            }
        };

        fetchEvent();
    }, [id, user, navigate, toast]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !event) return;

        setSaving(true);
        try {
            const formDataToSend = new FormData();

            // Format date for the backend
            const formattedDate = new Date(formData.date);
            const [hours, minutes] = formData.time.split(':').map(Number);
            formattedDate.setHours(hours, minutes);

            // Append all form fields with proper formatting
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('date', formattedDate.toISOString());
            formDataToSend.append('time', formData.time);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('locationType', formData.locationType);

            // Handle optional numeric fields
            if (formData.maxAttendees) {
                formDataToSend.append('maxAttendees', formData.maxAttendees.toString());
            }
            formDataToSend.append('price', formData.price.toString() || '0');

            // Handle boolean and optional fields
            formDataToSend.append('isPrivate', formData.isPrivate.toString());
            if (formData.registrationDeadline) {
                const deadline = new Date(formData.registrationDeadline);
                formDataToSend.append('registrationDeadline', deadline.toISOString());
            }

            // Append image if a new one is selected
            const imageInput = document.querySelector<HTMLInputElement>('input[type="file"]');
            if (imageInput?.files?.length) {
                formDataToSend.append('image', imageInput.files[0]);
            }

            await eventService.updateEvent(id, formDataToSend);

            toast({
                title: "Success",
                description: "Event updated successfully.",
            });
            navigate('/my-events');
        } catch (err: any) {
            console.error('Error updating event:', err);
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to update event. Please try again.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (!user || user.role !== 'organizer') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl text-red-600">Not Authorized</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4">Only organizers can edit events.</p>
                        <Button asChild>
                            <Link to="/events">Back to Events</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading event details...</p>
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
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
                        <p className="text-gray-600">Update your event details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <Label>Event Image</Label>
                            <div className="flex items-center gap-4">
                                {event?.image ? (
                                    <div className="relative w-32 h-32">
                                        <img
                                            src={`http://localhost:5000/uploads/${event.image}`}
                                            alt="Event"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
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
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Preview could be added here if needed
                                            }
                                        }}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Recommended size: 1200x600 pixels. Max size: 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Title
                                    </label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        className="h-32"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <Input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location Type
                                    </label>
                                    <Select
                                        value={formData.locationType}
                                        onValueChange={(value: LocationType) => handleSelectChange('locationType', value)}
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
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <Input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time
                                    </label>
                                    <Input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value: Category) => handleSelectChange('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Attendees
                                    </label>
                                    <Input
                                        type="number"
                                        name="maxAttendees"
                                        value={formData.maxAttendees}
                                        onChange={handleInputChange}
                                        min="1"
                                        placeholder="Leave empty for unlimited"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($)
                                    </label>
                                    <Input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Registration Deadline
                                    </label>
                                    <Input
                                        type="date"
                                        name="registrationDeadline"
                                        value={formData.registrationDeadline}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/my-events')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent; 