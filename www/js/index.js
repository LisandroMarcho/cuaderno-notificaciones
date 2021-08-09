const alumnosRef = firebase.database().ref("usuarios/alumnos/");
const avisosRef  = firebase.database().ref("avisos/");

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
   * @param {Object} credentials            Objeto con las credenciales
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
  static registrar({ email, dni, password }) {
    fireAuth().createUserWithEmailAndPassword(email, password)
      .then(async (user) => {
        await alumnosRef.child(dni).set({ email });
        return user;
      })
      .catch((e) => {
        console.log(e);
      });
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

class Aviso {
  /**
   * @param {Object} infoCurso            Objeto contenedor de la info del curso
   * @param {Number} infoCurso.curso      Año que del curso
   * @param {Number} infoCurso.division   Division del curso
   * @param {Object} bodyAviso            Objeto contenedor del cuerpo del aviso
   * @param {String} bodyAviso.titulo
   * @param {String} bodyAviso.texto
   * @param {String} bodyAviso.rolCreador
   * @param {String} body
   */
  constructor (infoCurso, bodyAviso) {
    this.infoCurso = infoCurso;
    this.body = bodyAviso;
  }

  async crear() {
    await avisosRef.child(this.infoCurso.curso)
      .child(this.infoCurso.division)
      .push(this.body);
  }

  static async traerTodos({ curso, division }) {
    const avisos = await avisosRef.child(curso).child(division).get();
    const avisosVal = avisos.val();
    return avisosVal;
  }
}

/**
 * Verifica si el cliente tiene una sesión iniciada
 * @param {Object} user 
 */
function isLoggedIn(user) {
  const pathname = window.location.pathname;
  const filename = pathname.slice(pathname.lastIndexOf("/") + 1);

  if(user == null) {
    if(filename !== 'login.html' && filename !== 'registro.html') {
      window.location = 'login.html';
    }
  } else {
    if(filename === 'login.html' || filename === 'registro.html') {
      window.location = 'index.html';
    }
  }
}

/**
 * Inicializa la applicación
 */
function initializeApp (){
  let sidebar = document.querySelector(".sidebar");
  let closeBtn = document.querySelector("#btn");
  let searchBtn = document.querySelector(".bx-search");

  closeBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("open");
    menuBtnChange();//calling the function(optional)
  });

  searchBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the search iocn
    sidebar.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)
  });

  firebase.auth().onAuthStateChanged(isLoggedIn);
  
  const initialyDisabledElements = document.querySelectorAll('.init-disabled');
  initialyDisabledElements.forEach((element) => {
    element.classList.remove('init-disabled');
    element.disabled = false;
  })
};





// following are the code to change sidebar button(optional)
function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
 }
}

