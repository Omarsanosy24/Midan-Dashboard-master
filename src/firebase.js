import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage} from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyBawKtTywhoYQgHZqF40AGSQX-lchrRvpc",
    authDomain: "wholesalesquare-362414.firebaseapp.com",
    projectId: "wholesalesquare-362414",
    storageBucket: "wholesalesquare-362414.appspot.com",
    messagingSenderId: "962873793446",
    appId: "1:962873793446:web:90dd29dc9e1d8e3a178d67",
    measurementId: "G-TDL59YQVSS"
  };
  

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const requestForToken = () => {
    return getToken(messaging, {vapidKey: "BIM3iyNYv6cukQIFhd7P41FuEyAlkk7mnL3NkR036gzQJCQnbM0uyxZTOSYnlcl8BpH2M7jaDT3XP80PJhaDde0"}).then((currentToken) => {
      if (currentToken) {
        return(currentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
        // shows on the UI that permission is required 
      }
    }).catch((err) => {

      console.log('error here');

      console.log('An error occurred while retrieving token. ', err);
    });
  }



export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});