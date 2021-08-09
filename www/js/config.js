const firebaseConfig = {
  apiKey: "AIzaSyACY7-nrXyrAxbYRP2-c5I34UNJOV3S4e8",
  authDomain: "cuaderno-comunicaciones.firebaseapp.com",
  databaseURL: "https://cuaderno-comunicaciones-default-rtdb.firebaseio.com",
  projectId: "cuaderno-comunicaciones",
  storageBucket: "cuaderno-comunicaciones.appspot.com",
  messagingSenderId: "153672834962",
  appId: "1:153672834962:web:7c04e421f2c9557a8cab4b",
};

firebase.initializeApp(firebaseConfig);

if(location.hostname === "localhost") {
	firebase.database().useEmulator("localhost", 9000);
	firebase.auth().useEmulator("http://localhost:9099");
}

const fireAuth = firebase.auth;