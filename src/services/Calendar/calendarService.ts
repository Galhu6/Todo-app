import { google } from "googleapis";

export interface CalendarEvent {
    summary: string;
    description?: string;
    startTime: string;
    endTime: string;
}

export async function creatCalendarEvent(accessToken: string, event: CalendarEvent) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
            summary: event.summary,
            description: event.description,
            start: { dateTime: event.startTime },
            end: { dateTime: event.endTime }
        },
    });
    return res.data
}