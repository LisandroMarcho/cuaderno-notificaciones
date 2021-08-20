const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector("#btn");

const cursosRef = firebase.database().ref("cursos/");

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
function registrarAlumno({ email, dni, password }) {
  firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async (user) => {
      await alumnosRef.child(dni).update({ email });
      localStorage.setItem("infoAlumno", JSON.stringify({}));
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
async function iniciarSesion({ dni, password }) {
  const alumnoRef = await alumnosRef.child(dni).get();
  const { email } = alumnoRef.val();
  const userCredential = await firebase.auth().signInWithEmailAndPassword(
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
function cerrarSesion() {
  firebase.auth().signOut();
}

/**
 * Verifica si el cliente tiene una sesión iniciada
 * @param {Object} user
 */
function isLoggedIn(user) {
  const pathname = window.location.pathname;
  const filename = pathname.slice(pathname.lastIndexOf("/") + 1);

  if (user == null) {
    if (filename !== "login.html" && filename !== "registro.html") {
      window.location = "login.html";
    }
  } else {
    if (filename === "login.html" || filename === "registro.html") {
      window.location = "index.html";
    }
  }
}

/**
 * Inicializa la applicación
 */
function initializeApp() {
  firebase.auth().onAuthStateChanged(isLoggedIn);

  closeBtn && closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)
  });

  const initiallyDisabledElements = document.querySelectorAll(".init-disabled");
  initiallyDisabledElements.forEach((element) => {
    element.classList.remove("init-disabled");
    element.disabled = false;
  });
}

// following are the code to change sidebar button(optional)
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns class
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns class
  }
}
