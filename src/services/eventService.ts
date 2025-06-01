import apiRequest from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationType: 'physical' | 'online';
  category: 'conference' | 'workshop' | 'seminar' | 'networking' | 'other';
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  attendees: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  }>;
  maxAttendees: number | null;
  price: number;
  isPrivate: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image: string;
  registrationDeadline?: string;
  additionalDetails?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  category?: string;
  status?: string;
  date?: string;
  search?: string;
  organizer?: string;
  page?: number;
  limit?: number;
}

export interface EventsResponse {
  events: Event[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface UserEvents {
  created: Event[];
  attending: Event[];
}

export const eventService = {
  async getAllEvents(filters?: EventFilters): Promise<EventsResponse> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    return apiRequest(`/events?${queryParams.toString()}`);
  },

  async getEvent(id: string): Promise<Event> {
    return apiRequest(`/events/${id}`);
  },

  async createEvent(eventData: Omit<Event, '_id' | 'organizer' | 'attendees' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id: string, eventData: Partial<Omit<Event, '_id' | 'organizer' | 'attendees'>>): Promise<Event> {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(id: string): Promise<void> {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  async joinEvent(id: string): Promise<Event> {
    return apiRequest(`/events/${id}/join`, {
      method: 'POST',
    });
  },

  async leaveEvent(id: string): Promise<Event> {
    return apiRequest(`/events/${id}/leave`, {
      method: 'POST',
    });
  },

  async getCalendarEvents(year: number, month: number): Promise<Event[]> {
    return apiRequest(`/events/calendar/${year}/${month}`);
  },

  async getMyEvents(): Promise<UserEvents> {
    return apiRequest('/events/my-events');
  },

  async getEventAttendees(id: string): Promise<Event['attendees']> {
    return apiRequest(`/events/${id}/attendees`);
  }
};
