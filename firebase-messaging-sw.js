importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Même configuration que dans ton index.html
const firebaseConfig = {
    apiKey: "AIzaSyCsJACTFFdHAFlvOQNw9h5spegq7lV2-zE",
    authDomain: "planning-jeudi.firebaseapp.com",
    projectId: "planning-jeudi",
    storageBucket: "planning-jeudi.firebasestorage.app",
    messagingSenderId: "894632315552",
    appId: "1:894632315552:web:aed8853528dec823d617c5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gère l'affichage de la notification en arrière-plan
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Message reçu en background ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png', // Tu peux mettre un lien vers le logo de ton app ici
        badge: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
