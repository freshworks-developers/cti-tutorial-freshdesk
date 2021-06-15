/**
 * Show a notification toast with the given type and message
 *
 * @param {String} type - type of the notification
 * @param {String} message - content to be shown in the notification
 **/
function showNotify(type, message) {
  return client.interface.trigger("showNotify", {
    type: type,
    message: message
  });
}

/**
 * It opens the ticket details page for the given ticket id
 *
 * @param {number} ticketId - Ticket to open
 */
function goToTicket(ticketId) {
  client.interface.trigger("click", { id: "ticket", value: ticketId })
    .then(function (data) {
      console.info('successfully navigated to ticket');
    }).catch(function (error) {
      console.error('Error: Failed to navigate to ticket');
      console.error(error);
    });
}

/**
 * It opens the contact details page for the give contact id
 *
 * @param {number} contactId - Contact to open
 */
function goToContact(contactId) {
  client.interface.trigger("click", { id: "contact", value: contactId })
    .then(function (data) {
      console.info('successfully navigated to contact');
    }).catch(function (error) {
      console.error('Error: Failed to navigate to contact');
      console.error(error);
    });
}

/**
 * It shows the given number in the CTI app widget as missed calls intimation
 *
 * @param {number} missedCalls - The number of missed calls to show in the CTI app icon
 */
function showMissedCall(missedCalls) {
  client.interface.trigger("show", { id: "missedCall", value: missedCalls })
    .then(function (data) {
      console.info('successfully shown missed calls');
    }).catch(function (error) {
      console.error('Error: failed to show missed calls');
      console.error(error);
    });
}

/**
 * It hides the missed calls intimation in the CTI app widget
 */
function hideMissedCall() {
  client.interface.trigger("hide", { id: "missedCall" })
    .then(function (data) {
      console.info('successfully hidden missed calls');
    }).catch(function (error) {
      console.error('Error: failed to hide missed calls');
      console.error(error);
    });
}

/**
 * It creates a ticket in Freshdesk for the call
 */
async function createTicket() {
  const callNotes = "Alice called Bob"
  const ticketDetails = {
    email: 'sample@email.com',
    subject: 'Call with the customer',
    priority: 1,
    description: `Ticket from call. Call Notes:${callNotes}`,
    status: 2
  }
  try {
    const ticketData = await client.request.post('https://<%= iparam.freshdesk_subdomain %>.freshdesk.com/api/v2/tickets',
      {
        headers: {
          Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
        },
        json: ticketDetails,
        method: "POST"
      });
    console.info('Successfully created ticket in Freshdesk');
    showNotify('success', 'Successfully created a ticket.');
  } catch (error) {
    console.error('Error: Failed to create a ticket in Freshdesk');
    console.error(error);
    showNotify('danger', 'failed to create a ticket. Try again later.');
  }
}

/**
 * It retrieves the list of contacts from Freshdesk
 */
function getContacts() {
  const url = 'https://<%= iparam.freshdesk_subdomain %>.freshdesk.com/api/v2/contacts';
  const options = {
    headers: {
      Authorization: 'Basic <%= encode(iparam.freshdesk_api_key) %>'
    }
  }
  client.request.get(url, options).then(contacts => {
    console.info('Success: Got contacts list');
    console.table(JSON.parse(contacts.response));
    return JSON.parse(contacts.response);
  }, error => {
    console.error(error);
    return reject(error);
  });
}

/**
 * It creates a contact in Freshdesk with the phone number
 */
function createContact() {
  const properties = {
    name: 'contact name',
    email: 'sample2@email.com',
    phone: '+0123456789',

  }
  const url = 'https://<%= iparam.freshdesk_subdomain %>.freshdesk.com/api/v2/contacts';
  const options = {
    headers: {
      Authorization: 'Basic <%= encode(iparam.freshdesk_api_key) %>'
    },
    json: properties
  }
  client.request.post(url, options).then(contact => {
    console.info('Success: Created contact');
    console.info(contact.response);
  }, error => {
    console.error('Error: Failed to create contact');
    console.error(error);
  });
}

/**
 * To get the logged in user in Freshdesk
 */
function getLoggedInUser() {
  client.data.get("loggedInUser").then(
    function (data) {
      console.info('Successfully got loggedInUser data');
      showNotify('info', `User's name: ${data.loggedInUser.contact.name}`);
    },
    function (error) {
      console.error('Error: Failed to get the loggedInUser information');
      console.error(error);
    });
}

/**
 * To open the CTI app
 */
function openApp() {
  client.interface.trigger("show", { id: "softphone" })
    .then(function () {
      console.info('Success: Opened the app');
    }).catch(function (error) {
      console.error('Error: Failed to open the app');
      console.error(error);
    });
}

/**
 * To close the CTI app
 */
function closeApp() {
  client.interface.trigger("hide", { id: "softphone" }).then(function (data) {
    console.info('successfully closed the CTI app');
    showNotify('success', 'Successfully closed the CTI app.');
  }).catch(function (error) {
    console.error('Error: Failed to close the CTI app');
    console.error(error);
  });
}

/**
 * To listen to click event for phone numbers in the Freshdesk pages and use the clicked phone number
 */
function clickToCall() {
  const textElement = document.getElementById('appText');

  client.events.on("cti.triggerDialer", function (event) {
    openApp();
    var data = event.helper.getData();
    textElement.innerText = `Clicked phone number: ${data.number}`;
  });
}

/**
 * To resize the height of the CTI app
 */
function resizeApp() {
  client.instance.resize({ height: '450px' });
}

function onAppActivate() {
  /* Sample values to test the app functionality */
  const TICKET_ID = 12;
  const CONTACT_ID = 48012335223;
  const MISSED_CALLS = 11;

  resizeApp();

  /* Adding event handlers for all the buttons in the UI of the app */
  document.getElementById('btnGetUser').addEventListener('fwClick', getLoggedInUser);
  document.getElementById('btnClose').addEventListener('fwClick', closeApp);
  document.getElementById('btnShowMissedCalls').addEventListener('fwClick', function () { showMissedCall(MISSED_CALLS) });
  document.getElementById('btnHideMissedCalls').addEventListener('fwClick', hideMissedCall);
  document.getElementById('btnCreateTicket').addEventListener('fwClick', createTicket);
  document.getElementById('btnGotoTicket').addEventListener('fwClick', function () { goToTicket(TICKET_ID) });
  document.getElementById('btnGetContacts').addEventListener('fwClick', getContacts);
  document.getElementById('btnCreateContact').addEventListener('fwClick', createContact);
  document.getElementById('btnGotoContact').addEventListener('fwClick', function () { goToContact(CONTACT_ID) });
  /* Click-to-call event should be called inside the app.activated life-cycle event to always listen to the event */
  clickToCall();
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(console.error);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};
