import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

const API_URL = 'http://localhost:5000/api';

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
    email: string;
  };
  attendees: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  maxAttendees: number | null;
  price: number;
  isPrivate: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image?: string;
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
  total: number;
  totalPages?: number;
  currentPage?: number;
}

export interface UserEvents {
  created: Event[];
  attending: Event[];
}

const getHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const eventService = {
  async getAllEvents(params?: { category?: string; search?: string }) {
    const response = await axios.get(`${API_URL}/events`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  async getEvent(id: string) {
    const response = await axios.get(`${API_URL}/events/${id}`, getHeaders());
    return response.data;
  },

  async createEvent(eventData: FormData) {
    const response = await axios.post(`${API_URL}/events`, eventData, {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async updateEvent(id: string, eventData: FormData) {
    const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async deleteEvent(id: string) {
    const response = await axios.delete(`${API_URL}/events/${id}`, getHeaders());
    return response.data;
  },

  async joinEvent(id: string) {
    const response = await axios.post(`${API_URL}/events/${id}/join`, {}, getHeaders());
    return response.data;
  },

  async leaveEvent(id: string) {
    const response = await axios.post(`${API_URL}/events/${id}/leave`, {}, getHeaders());
    return response.data;
  },

  async getCalendarEvents(year: number, month: number) {
    const response = await axios.get(`${API_URL}/events/calendar/${year}/${month}`, getHeaders());
    return response.data;
  },

  async getMyEvents(): Promise<UserEvents> {
    const response = await axios.get<UserEvents>(`${API_URL}/events/my-events`, getHeaders());
    return response.data;
  },

  async getEventAttendees(id: string): Promise<Event['attendees']> {
    const response = await axios.get<Event['attendees']>(`${API_URL}/events/${id}/attendees`, getHeaders());
    return response.data;
  },

  async getOrganizerEvents(organizerId: string) {
    const response = await axios.get(`${API_URL}/events/organizer/${organizerId}`, getHeaders());
    return response.data;
  },

  async registerForEvent(eventId: string, userId: string): Promise<void> {
    await axios.post(`${API_URL}/events/${eventId}/register/${userId}`, {}, getHeaders());
  },

  async unregisterFromEvent(eventId: string, userId: string): Promise<void> {
    await axios.post(`${API_URL}/events/${eventId}/unregister/${userId}`, {}, getHeaders());
  }
};
