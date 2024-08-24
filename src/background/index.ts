// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/
import { addEvent } from "../storage";
import { GoogleCalendarService } from "../services/googleCalendarService";

const googleCalendarService = new GoogleCalendarService();

chrome.runtime.onInstalled.addListener(() => {
    console.log("Endevor extension installed.");
    
    // Clear local storage for debugging purposes
    chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
            console.error("Error clearing local storage:", chrome.runtime.lastError);
        } else {
            console.log("Local storage cleared.");
        }
    });
    // chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    //     console.log(token)
    // });
    chrome.tabs.create({ url: "src/background/app.html" });
  });
  
//   chrome.action.onClicked.addListener(() => {
//     chrome.identity.getAuthToken({ interactive: true }, (token) => {
//       if (chrome.runtime.lastError) {
//         console.error(chrome.runtime.lastError);
//         return;
//       }
//       console.log('Token acquired:', token);
//       // Use the token to access Google Calendar API
//     });
//   });

// NOTE: If you want to toggle the side panel from the extension's action button,
// you can use the following code:
// chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
//    .catch((error) => console.error(error));

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//     console.log('Request received:', request);
//     if (request.action === 'storeEventDetails') {
//         const endeavorName = request.endeavorName;

//         //Get last edited event from google calendar
//         const lastEditedEvent = await googleCalendarService.getMostRecentEvent();
//         console.log('Last edited event:', lastEditedEvent);
        
//         // Store the event details in local storage
//         // addEvent(endeavorName, () => {
//         //     console.log('Event details stored:', endeavorName);
//         // });
        
//         // Optionally send a response back
//         sendResponse({ status: 'success' });
//     }
// });
