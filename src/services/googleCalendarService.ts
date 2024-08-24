import { Endeavor } from '../models';
import { addEndeavor, getEndeavors } from '../storage';

export class GoogleCalendarService {
  private token: string | null = null;

  async authenticate() {
    return new Promise<string>((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
            if (token) {
                this.token = token;
                resolve(token);
            } else {
                reject(new Error('No token received'));
            }
        }
      });
    });
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    if (!this.token) {
      await this.authenticate();
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 410) {
        throw new Error(`Resource is gone! status: ${response.status}`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    return response.json();
  }

  async createEvent() {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    // Open the Google Calendar event creation page without parameters
    window.open(`${baseUrl}`, '_blank');

    // After creating the event, fetch the most recent event
    const recentEventId = await this.getMostRecentEvent();
    if (recentEventId) {
      console.log('Most recent event ID:', recentEventId);
      // You can now store this ID or perform further actions
    }
  }

  async createBlankEvent() {
    const calendarId = 'primary'; // Use 'primary' for the user's primary calendar
    const event = {
        summary: '', // Blank event title
        description: '', // Blank event description
        start: {
            dateTime: new Date().toISOString(), // Start time
            timeZone: 'UTC', // Adjust as necessary
        },
        end: {
            dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // End time (1 hour later)
            timeZone: 'UTC', // Adjust as necessary
        },
    };

    // Create the event using the Google Calendar API
    const response = await this.fetchWithAuth(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
    });

    // Get the event ID from the response
    const eventId = response.id;
    const url = response.htmlLink;
    const parsedUrl = new URL(url);
    const urlID = parsedUrl.searchParams.get('eid');
    console.log('Created event ID:', urlID);

    // Construct the URL to edit the event
    const editUrl = `https://calendar.google.com/calendar/u/0/r/eventedit/${urlID}`; // Base64 encode the event ID
    window.open(editUrl, '_blank'); // Open the edit URL in a new tab
    return {url_id: urlID, id: eventId};
}

async getEventByID(eventId: string) {
    const calendarId = 'primary'; // Use 'primary' for the user's primary calendar
    // Use the correct endpoint to fetch a single event by its ID
    const response = await this.fetchWithAuth(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`);
    return response; // This should now return a single event
}

  async getMostRecentEvent() {
    const calendarId = 'primary'; // Use 'primary' for the user's primary calendar
    const now = new Date();
    const TIME_DIFF = 60 * 60 * 1000; // 1 hour in milliseconds
    const earlier = new Date(now.getTime() - TIME_DIFF);

    const params = new URLSearchParams({
        updatedMin: earlier.toISOString(),
        maxResults: '50',
        singleEvents: 'true',
        orderBy: 'updated', // Order by the last updated time
        showDeleted: 'false'
    });

    try {
        const response = await this.fetchWithAuth(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`);
        if (response.items && response.items.length > 0) {
            // Return the event ID of the most recently modified event
            return response.items[response.items.length - 1];
        }
        return null; // No events found
    } catch (error) {
        console.error('Error fetching the most recent event:', error);
        return null;
    }
  }

  async syncCalendarToEndeavorStore(endeavor: Endeavor) {
    const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    const params = new URLSearchParams({
      timeMin: (new Date()).toISOString(),
      maxResults: '100',
      singleEvents: 'true',
      orderBy: 'startTime',
    });
    const response = await this.fetchWithAuth(`${baseUrl}?${params}`);
    const events = response.items;
    await this.saveEventsToStorage(events);
  }

  private async saveEventsToStorage(events: any[]) {
    // Retrieve existing events from local storage
    const existingEvents = await new Promise<any[]>((resolve) => {
      chrome.storage.local.get(['event_data'], (result) => {
        resolve(result.events || []);
      });
    });

    // Filter out events that are already in local storage
    const newEvents = events.filter(event => 
      !existingEvents.some(existingEvent => existingEvent.googleCalendarId === event.googleCalendarId)
    );

    // Add new events to the existing events list
    const updatedEvents = [...existingEvents, ...newEvents];

    // Save the updated events list back to local storage
    await new Promise<void>((resolve) => {
      chrome.storage.local.set({ events: updatedEvents }, () => {
        resolve();
      });
    });
  }
}

export const googleCalendarService = new GoogleCalendarService();