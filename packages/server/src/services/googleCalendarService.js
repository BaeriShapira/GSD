import { google } from 'googleapis';
import { decrypt, encrypt } from '../utils/encryption.js';
import { updateUserGoogleTokens } from '../repositories/userRepository.js';

/**
 * Initialize Google Calendar API client for a user
 * @param {Object} user - User object with Google tokens
 * @returns {Object} calendar - Google Calendar API client
 */
export async function initGoogleCalendar(user) {
    if (!user.googleRefreshToken) {
        throw new Error('User has not connected Google Calendar');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    // Decrypt tokens
    const refreshToken = decrypt(user.googleRefreshToken);
    const accessToken = user.googleAccessToken ? decrypt(user.googleAccessToken) : null;

    // Set credentials
    oauth2Client.setCredentials({
        refresh_token: refreshToken,
        access_token: accessToken,
        expiry_date: user.googleTokenExpiry ? new Date(user.googleTokenExpiry).getTime() : null,
    });

    // Set up token refresh handler
    oauth2Client.on('tokens', async (tokens) => {
        console.log('📅 Google tokens refreshed');

        if (tokens.refresh_token) {
            // New refresh token received
            await updateUserGoogleTokens(user.id, {
                googleRefreshToken: encrypt(tokens.refresh_token),
                googleAccessToken: tokens.access_token ? encrypt(tokens.access_token) : null,
                googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                googleCalendarId: user.googleCalendarId,
            });
        } else if (tokens.access_token) {
            // Only access token refreshed
            await updateUserGoogleTokens(user.id, {
                googleRefreshToken: user.googleRefreshToken, // Keep existing
                googleAccessToken: encrypt(tokens.access_token),
                googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                googleCalendarId: user.googleCalendarId,
            });
        }
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    return calendar;
}

/**
 * Manually refresh access token if expired
 * @param {Object} user - User object with Google tokens
 * @returns {Object} Updated user tokens
 */
export async function refreshAccessToken(user) {
    if (!user.googleRefreshToken) {
        throw new Error('No refresh token available');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    const refreshToken = decrypt(user.googleRefreshToken);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();

    // Save new tokens
    await updateUserGoogleTokens(user.id, {
        googleRefreshToken: user.googleRefreshToken, // Keep existing
        googleAccessToken: credentials.access_token ? encrypt(credentials.access_token) : null,
        googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
        googleCalendarId: user.googleCalendarId,
    });

    return credentials;
}

/**
 * Create event in Google Calendar
 * @param {Object} user - User object
 * @param {Object} eventData - Event data following Google Calendar API format
 * @returns {Object} Created event
 */
export async function createEvent(user, eventData) {
    const calendar = await initGoogleCalendar(user);
    const calendarId = user.googleCalendarId || 'primary';

    const response = await calendar.events.insert({
        calendarId,
        requestBody: eventData,
    });

    return response.data;
}

/**
 * Update event in Google Calendar
 * @param {Object} user - User object
 * @param {string} googleEventId - Google Calendar event ID
 * @param {Object} eventData - Updated event data
 * @returns {Object} Updated event
 */
export async function updateEvent(user, googleEventId, eventData) {
    const calendar = await initGoogleCalendar(user);
    const calendarId = user.googleCalendarId || 'primary';

    const response = await calendar.events.update({
        calendarId,
        eventId: googleEventId,
        requestBody: eventData,
    });

    return response.data;
}

/**
 * Delete event from Google Calendar
 * @param {Object} user - User object
 * @param {string} googleEventId - Google Calendar event ID
 */
export async function deleteEvent(user, googleEventId) {
    const calendar = await initGoogleCalendar(user);
    const calendarId = user.googleCalendarId || 'primary';

    await calendar.events.delete({
        calendarId,
        eventId: googleEventId,
    });
}

/**
 * List events in a time range
 * @param {Object} user - User object
 * @param {Date} timeMin - Start of time range
 * @param {Date} timeMax - End of time range
 * @returns {Array} List of events
 */
export async function listEvents(user, timeMin, timeMax) {
    const calendar = await initGoogleCalendar(user);
    const calendarId = user.googleCalendarId || 'primary';

    const response = await calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });

    return response.data.items || [];
}

/**
 * Setup webhook for Google Calendar push notifications
 * @param {Object} user - User object
 * @param {string} calendarId - Calendar ID to watch
 * @returns {Object} Watch response
 */
export async function setupWebhook(user, calendarId = 'primary') {
    const calendar = await initGoogleCalendar(user);
    const webhookUrl = process.env.GOOGLE_CALENDAR_WEBHOOK_URL;

    if (!webhookUrl) {
        throw new Error('GOOGLE_CALENDAR_WEBHOOK_URL not configured');
    }

    const response = await calendar.events.watch({
        calendarId,
        requestBody: {
            id: `gsd-${user.id}-${Date.now()}`, // Unique channel ID
            type: 'web_hook',
            address: webhookUrl,
        },
    });

    return response.data;
}

/**
 * Stop webhook for Google Calendar
 * @param {string} channelId - Channel ID to stop
 * @param {string} resourceId - Resource ID from watch response
 */
export async function stopWebhook(channelId, resourceId) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.channels.stop({
        requestBody: {
            id: channelId,
            resourceId: resourceId,
        },
    });
}
