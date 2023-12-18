let loginForm = document.getElementById('loginForm');
let signupForm = document.getElementById('signupForm');
let spinner = document.getElementById('spinner');
let spinnerTwo = document.getElementById('spinnerTwo');

if (loginForm !== null) {
  loginForm.addEventListener('submit', function () {
    // event.preventDefault(); // Evitar que el formulario se envíe por defecto

    let loginBtn = document.getElementById('loginBtn');
    let loginText = document.getElementById('loginText');

    loginBtn.disabled = true;
    loginText.style.display = 'none';
    spinner.style.display = 'inline-block';

    window.addEventListener('load', function () {
      // Volver a mostrar el texto y ocultar el spinner cuando la página se haya cargado completamente
      loginText.style.display = 'inline-block';
      spinner.style.display = 'none';
    });
  });
}

if (signupForm !== null) {
  signupForm.addEventListener('submit', function () {
    // event.preventDefault(); // Evitar que el formulario se envíe por defecto

    let signupBtn = document.getElementById('signupBtn'); // Si existe un botón específico para el formulario de registro
    let signupText = document.getElementById('signupText'); // Si existe un texto específico para el formulario de registro

    // Si existen elementos específicos para el formulario de registro, puedes manipularlos aquí

   signupBtn.disabled = true;
   signupText.style.display = 'none';
   spinnerTwo.style.display = 'inline-block';

    window.addEventListener('load', function () {
      // Volver a mostrar el texto y ocultar el spinner cuando la página se haya cargado completamente
     signupText.style.display = 'inline-block';
     spinnerTwo.style.display = 'none';
    });
  });
}


// document.getElementById('loginForm',).addEventListener('submit', function() {
//   // event.preventDefault(); // Evitar que el formulario se envíe por defecto

//   // Ocultar el texto y mostrar el spinner
//   let loginBtn = document.getElementById('loginBtn');
//   let loginText = document.getElementById('loginText');
//   let spinner = document.getElementById('spinner');

//   loginBtn.disabled = true;
//   loginText.style.display = 'none';
//   spinner.style.display = 'inline-block';

//   window.addEventListener('load', function() {
//     // Volver a mostrar el texto y ocultar el spinner cuando la página se haya cargado completamente
//     loginText.style.display = 'inline-block';
//     spinner.style.display = 'none';

//   });
// });
