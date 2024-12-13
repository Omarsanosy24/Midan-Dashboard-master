// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBawKtTywhoYQgHZqF40AGSQX-lchrRvpc",
    authDomain: "wholesalesquare-362414.firebaseapp.com",
    projectId: "wholesalesquare-362414",
    storageBucket: "wholesalesquare-362414.appspot.com",
    messagingSenderId: "962873793446",
    appId: "1:962873793446:web:90dd29dc9e1d8e3a178d67",
    measurementId: "G-TDL59YQVSS"
  };
  

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});