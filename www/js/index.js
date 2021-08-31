const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector("#btn");
const selectAlumnos = document.querySelector("#selectorAlumnos");
const cursosRef = firebase.database().ref("cursos/");
const padresRef = firebase.database().ref("padres/");

let alumnoActual = null;
let alumnosVinculados = [];
let horarios = [];
let avisos = [];

/**
 * Registra un usuario con email y contraseña.
 * TODO: Vincular dni con el usuario
 * @param {String} email      Correo electronico del usuario
 * @param {String} password   Contraseña del usuario
 * @example
 * const credenciales = {
 *  email: 'mail@example.com',
 *  password: 'example_password'
 * };
 *
 * const result = await registrarAlumno(credenciales);
 * @returns {Promise<Object>} User or error
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
 * Verifica si el cliente tiene una sesión iniciada. También carga los alumnos vinculados en memoria.
 * @param {Object} usuario
 */
async function esUsuarioValido(usuario) {
  const windowPath = window.location.pathname;
  const actualFile = windowPath.slice(windowPath.lastIndexOf("/") + 1);

  // El usuario no esta logeado
  if (usuario === null) {
    if (actualFile !== "login.html" && actualFile !== "registro.html") {
      window.location = "login.html";
    }
  }


  await padresRef.child(usuario.uid).once("value", (alumnosSnap) => {
    const nuevoAlumnoOption = '<option value="nuevoVinculo">AÑADIR ALUMNO</option>';
    if(selectAlumnos) selectAlumnos.innerHTML = '';

    alumnosSnap.forEach((snap) => {
      alumnosVinculados.push({dni: snap.key, ...snap.val()});
      
      if(selectAlumnos) selectorAlumnos.innerHTML += `<option data-curso="${snap.child('curso').val()}" value="${snap.key}" ${alumnoActual.dni == snap.key && 'selected="selected"' }}>${snap.key}</option>`;
      if(!localStorage.getItem('alumno-actual')) localStorage.setItem('alumno-actual', JSON.stringify(alumnosVinculados[0]));
    });

    if(selectAlumnos) selectAlumnos.innerHTML += nuevoAlumnoOption;
  });

  // No hay alumnos vinculados
  if (alumnosVinculados.length === 0 && actualFile !== "vincular.html") {
    window.location = "vincular.html";
  }

  // Hay alumnos vinculados y una sesion activa.
  if (alumnosVinculados.length > 0) {
    if (actualFile === "login.html" || actualFile === "registro.html") {
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
 * TODO: Agregar vinculo del alumno con el padre
 * @param {Object} usuario Usuario actual
 * @param {string} cursoAlumno ID del curso actual
 * @param {string} dniAlumno DNI del alumno a vincular
 */
async function vincularAlumno(usuario, cursoAlumno, dniAlumno) {
  const alumnoSnap = await cursosRef.child(cursoAlumno).child('alumnos').child(dniAlumno).get();
  const alumnoVal = await alumnoSnap.val();
  
  if(alumnoVal !== null) {
    await padresRef.child(usuario.uid).child(dniAlumno).update({ curso: cursoAlumno });
    // await cursosRef.child(cursoAlumno).child('alumnos').child(dniAlumno).child('padres').child({ padre: firebase.auth().currentUser.uid }).set(true);
    if(!confirm('Alumno vinculado exitosamente. \n¿Desea vincular otro alumno?')) window.location = 'index.html';
  } else alert('No se encuentra al alumno en ese curso.');
}

/**
 * Trae los datos de un alumno en específico.
 * @param {string} keyCurso Identificador del curso
 * @param {string} keyAlumno Identificador del Alumno (DNI)
 * @returns {Object} Información del alumno
 */
async function obtenerDatosAlumno (keyCurso, keyAlumno) {
  const alumnoSnap = await cursosRef.child(keyCurso).child('alumnos').child(keyAlumno).get();
  const alumnoVal  = await alumnoSnap.val();
  return {...alumnoVal, curso: keyCurso};
}

/**
 * Recupera los horarios de un curso en específico.
 * @param {string} keyCurso Identificador del curso
 * @returns {DataSnapshot}
 */
async function obtenerHorarios (keyCurso) {
  const horariosSnap = await cursosRef.child(keyCurso).child('horarios').get();
  return horariosSnap;
}

/**
 * Recupera la lista de avisos de un curso en específico.
 * @param {string} keyCurso Identificador del curso
 * @returns {DataSnapshot}
 */
async function obtenerAvisos (keyCurso = null) {
  const avisosSnap = await cursosRef.child(keyCurso || alumnoActual.curso).child('avisos').get();
  return avisosSnap;
}

/**
 * Actualiza `alumno-actual` en `localStorage`.
 * @param {HTMLSelectElement} select Selector de cambio de alumno
 */
function cambiarAlumno(select) {
  const alumno = {
    dni: select.value,
    curso: select.options[select.options.selectedIndex].dataset.curso
  };

  if(select.value === "nuevoVinculo") window.location = 'vincular.html';
  else {
    localStorage.setItem('alumno-actual', JSON.stringify(alumno));
    window.location.reload();
  }
}

/**
 * Establece la variable global `alumnoActual` con el item almacenado en `alumno-actual`
 * desde `localStorage`.
 */
function cargarAlumnoActual() {
  const jsonString = localStorage.getItem('alumno-actual');
  const alumno = JSON.parse(jsonString);
  alumnoActual = { ...alumno };
}

/**
 * Inicializa la applicación
 * @param {Function} callback Se ejecuta después de inicializar lo básico.
 */
function initializeApp(callback = () => {}) {
  cargarAlumnoActual();

  window.onload = () => {
    firebase.auth().onAuthStateChanged(esUsuarioValido);

    closeBtn && closeBtn.addEventListener("click", toggleSidenav);
    const initiallyDisabledElements = document.querySelectorAll(".init-disabled");
    initiallyDisabledElements.forEach((element) => {
      element.classList.remove("init-disabled");
      element.disabled = false;
    });
  
    callback();
  }
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