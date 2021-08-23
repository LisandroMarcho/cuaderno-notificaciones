const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector("#btn");

const cursosRef = firebase.database().ref("cursos/");
const padresRef = firebase.database().ref("padres/");

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
 * const result = await registrarAlumno(credenciales);
 * @returns {Object} User or error
 */
async function registrarAlumno(email, password) {
  try {
    const createdUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    return createdUser;
  } catch (error) {
    switch (error.code) {
      case "auth/weak-password":
        alert("Tu contraseña debe ser de al menos 6 carácteres.");
        break;
      case "auth/email-already-in-use":
        alert("El correo ya está en uso. Utiliza uno diferente.");
        break;
      default:
        alert("Hubo un error en el registro del usuario.");
        break;
    }
  }
}

/**
 * Autentica un usuario con un email y contraseña
 * TODO: Alerta de errores
 * @param {Object} credentials            Objeto con las credenciales
 * @param {Number} credentials.dni        DNI del usuario
 * @param {String} credentials.password   Contraseña del usuario
 * @example
 * const credenciales = {
 *  email: 'mail@example.com',
 *  password: 'example_password'
 * };
 *
 * const result = await iniciarSesion(credenciales);
 * @returns {Object} User or error
 */
async function iniciarSesion(email, password) {
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        alert("No se encontró el usuario.");
        break;
      case "auth/wrong-password":
        alert("Contraseña incorrecta.");
        break;
    }
  }
}

/**
 * Cierra la sesión del alumno.
 * @example
 * cerrarSesion();
 */
function cerrarSesion() {
  firebase.auth().signOut();
}

/**
 * Verifica si el cliente tiene una sesión iniciada
 * @param {Object} usuario
 */
async function esUsuarioValido(usuario) {
  const pathname = window.location.pathname;
  const filename = pathname.slice(pathname.lastIndexOf("/") + 1);

  if (usuario === null) {
    if (filename !== "login.html" && filename !== "registro.html") {
      window.location = "login.html";
    }
  }

  const infoPadreSnap = await padresRef.child(usuario.uid).get();
  const infoPadre = await infoPadreSnap.val();

  if (infoPadre === null && filename !== "vincular.html") {
    window.location = "vincular.html";
  }

  if (infoPadre !== null) {
    if (filename === "login.html" || filename === "registro.html") {
      window.location = "index.html";
    }
  }
}

/**
 * Devuelve la lista completa de cursos.
 * **USAR CON PRECAUCION: TRAE EL OBJETO DE CURSOS COMPLETO**
 * @returns {Object} Array de cursos
 */
async function obtenerCursos() {
  let arr = [];
  
  await cursosRef.once("value", (cursosSnap) => {
    cursosSnap.forEach(curso => {
      arr[curso.key] = curso.child('ident').val();
    });
  });

  return arr;
}

/**
 * Vincula un padre con un alumno.
 * @param {Object} usuario Usuario actual
 * @param {string} cursoAlumno ID del curso actual
 * @param {string} dniAlumno DNI del alumno a vincular
 */
async function vincularAlumno(usuario, cursoAlumno, dniAlumno) {
  const alumnoSnap = await cursosRef.child(cursoAlumno).child('alumnos').child(dniAlumno).get();
  const alumnoVal = await alumnoSnap.val();
  
  if(alumnoVal !== null) {
    await padresRef.child(usuario.uid).child(dniAlumno).update({ curso: cursoAlumno });
    await cursosRef.child(cursoAlumno).child('alumnos').child(dniAlumno).child('padres').child({ padre: firebase.auth().currentUser.uid }).set(true);
    if(!confirm('Alumno vinculado exitosamente. \n¿Desea vincular otro alumno?')) window.location = 'index.html';
  } else alert('No se encuentra al alumno en ese curso.');

}

/**
 * Inicializa la applicación
 */
function initializeApp() {
  firebase.auth().onAuthStateChanged(esUsuarioValido);

  closeBtn && closeBtn.addEventListener("click", toggleSidenav);

  const initiallyDisabledElements = document.querySelectorAll(".init-disabled");

  initiallyDisabledElements.forEach((element) => {
    element.classList.remove("init-disabled");
    element.disabled = false;
  });
}

/**
 * Abre y cierra el sidenav.
 */
function toggleSidenav() {
  sidebar.classList.toggle("open");
  actualizarBtnSidenav();
}

/**
 * Cambia el diseño del ícono del sidenav.
 */
function actualizarBtnSidenav() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns class
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns class
  }
}
