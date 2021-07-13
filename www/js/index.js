// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// document.addEventListener("deviceready", onDeviceReady, false);

// /**
// Funcion por defecto de Cordova para cuando se pueden usar las API
// /
// function onDeviceReady() {

// }

window.onload = () => {
  firebase.auth().onAuthStateChanged(isLoggedIn);
};

function isLoggedIn(user) {
  const pathname = window.location.pathname;
  const filename = pathname.slice(pathname.lastIndexOf("/") + 1);

  if (user) {
    console.log(user.uid);
  }

  // Si no hay un usuario
  if (user == null) {
    console.log(null);
  }
}
