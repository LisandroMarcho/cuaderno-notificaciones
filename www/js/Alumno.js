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
  static async registrar({ email, password }) {
    try {
      const userCredential = await fireAuth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      const errorCode = await error.code;
      return { error: errorCode };
    }
  }

  /**
   * Autentica un usuario con un email y contraseña
   * @param {Object} credentials            Objeto con las credenciales
   * @param {String} credentials.email      Correo electronico del usuario
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
  static async iniciarSesion({ email, password }) {
    try {
      const userCredential = await fireAuth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      const errorCode = error.code;
      return { error:errorCode }
    }
  }

  /**
   * Cierra la sesión del alumno. El cambio de estado de usuario se puede ver 
   * reflejado en el listener ```fireAuth().onAuthStateChanged((user) => {...})```.
   * @example
   * Alumno.cerrarSesion();
   */
  static async cerrarSesion() {
    await fireAuth().signOut();
  }
}

// fireAuth().onAuthStateChanged((user)=>{
//   if(user !== null) console.log(user.uid)
//   else console.log(null)
// })