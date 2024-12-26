const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let authorizeButton = document.getElementById('authorize-button');
let signoutButton = document.getElementById('signout-button');
let createEventButton = document.getElementById('create-event-button');

// Load and initialize Google API
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initialize the API client library
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(() => {
      const authInstance = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes
      authInstance.isSignedIn.listen(updateSigninStatus);

      // Check the current sign-in status
      updateSigninStatus(authInstance.isSignedIn.get());

      authorizeButton.onclick = () => authInstance.signIn();
      signoutButton.onclick = () => authInstance.signOut();
    })
    .catch((error) => console.error('Error initializing API:', error));
}

// Update UI based on sign-in status
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    createEventButton.style.display = 'block';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    createEventButton.style.display = 'none';
  }
}

// Create Google Calendar Event
function createCalendarEvent() {
  const event = {
    summary: 'Team Meeting',
    location: 'Conference Room',
    description: 'Weekly team sync-up',
    start: {
      dateTime: '2024-12-30T10:00:00-07:00',
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: '2024-12-30T11:00:00-07:00',
      timeZone: 'America/New_York',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  gapi.client.calendar.events
    .insert({
      calendarId: 'primary',
      resource: event,
    })
    .then((response) => {
      console.log('Event created:', response);
      alert('Event created successfully!');
    })
    .catch((error) => console.error('Error creating event:', error));
}

// Add click listener to create event button
createEventButton.onclick = createCalendarEvent;

// Load Google API client
handleClientLoad();
