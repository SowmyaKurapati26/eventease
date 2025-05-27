
import apiRequest from './api';

export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  attendees?: string[];
  maxAttendees?: number;
  category: string;
  price: string;
  isPrivate?: boolean;
}

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    return apiRequest('/events');
  },

  async getEventById(id: string): Promise<Event> {
    return apiRequest(`/events/${id}`);
  },

  async createEvent(eventData: Omit<Event, '_id' | 'organizer' | 'attendees'>): Promise<Event> {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
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
  }
};
