const alumnosRef = firebase.database().ref("usuarios/alumnos/");

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// document.addEventListener("deviceready", onDeviceReady, false);

// /**
// Funcion por defecto de Cordova para cuando se pueden usar las API
// /
// function onDeviceReady() {

// }

class Alumno {
  /**
   * Inicializa una nueva instancia de Alumno, y permite manipular su información. Además, hace
   * una copia del usuario de Firebase.
   *
   * @example
   * const user = new Alumno();
   */
  constructor() {
    this.firebaseUser = fireAuth().currentUser;
  }

  /**
   * Registra un usuario con email y contraseña.
   * TODO: Vincular dni con el usuario
   * @param {object} credentials            Objeto con las credenciales
   * @param {String} credentials.email      Correo electronico del usuario
   * @param {Number} credentials.dni        DNI del usuario
   * @param {String} credentials.password   Contraseña del usuario
   * @example
   * const credenciales = {
   *  email: 'mail@example.com',
   *  password: 'example_password'
   * };
   *
   * const result = await Alumno.registrar(credenciales);
   * @returns {Object} User or error
   */
  static async registrar({ email, dni, password }) {
    await alumnosRef.child(dni).set({ email });
    const userCredential = await fireAuth().createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  }

  /**
   * Autentica un usuario con un email y contraseña
   * @param {Object} credentials            Objeto con las credenciales
   * @param {Number} credentials.dni        DNI del usuario
   * @param {String} credentials.password   Contraseña del usuario
   * @example
   * const credenciales = {
   *  email: 'mail@example.com',
   *  password: 'example_password'
   * };
   *
   * const result = await Alumno.iniciarSesion(credenciales);
   * @returns {Object} User or error
   */
  static async iniciarSesion({ dni, password }) {
    const alumnoRef = await alumnosRef.child(dni).get();
    const { email } = alumnoRef.val();
    const userCredential = await fireAuth().signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  }

  /**
   * Cierra la sesión del alumno.
   * @example
   * Alumno.cerrarSesion();
   */
  static cerrarSesion() {
    fireAuth().signOut();
  }
}

/**
 * Verifica si el cliente tiene una sesión iniciada
 * @param {Object} user 
 */
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

/**
 * Inicializa la applicación
 */
function initializeApp (){
  firebase.auth().onAuthStateChanged(isLoggedIn);
};