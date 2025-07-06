import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Esta configuración DEBE ser la misma que la de tu página de login.html
const firebaseConfig = {
            apiKey: "AIzaSyC5RaMnG4Qr0jQWkACovPIdEpPSc7FhJqg",
            authDomain: "web-miembros-ucdm.firebaseapp.com",
            projectId: "web-miembros-ucdm",
            storageBucket: "web-miembros-ucdm.appspot.com",
            messagingSenderId: "203515685884",
            appId: "1:203515685884:web:96a82944170c86171ba079",
            measurementId: "G-PWEQZRT39B"
        };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Esta función estará disponible en tus páginas para poder cerrar sesión
window.handleLogout = function() {
    signOut(auth).then(() => {
        console.log('Usuario ha cerrado sesión');
        window.location.href = './login.html?mode=login';
    }).catch((error) => {
        console.error('Error al cerrar sesión', error);
    });
}

onAuthStateChanged(auth, (user) => {
    const body = document.querySelector('body');
    if (!user) {
        // Si no hay usuario y no estamos ya en la página de login, redirigir.
        if (window.location.pathname.indexOf('login.html') === -1) {
            console.log('Usuario no autenticado. Redirigiendo a login...');
            window.location.href = './login.html';
        }
    } else {
        // El usuario está autenticado. Mostramos el contenido de la página.
        body.style.opacity = '1';
        body.style.visibility = 'visible';
        
        // Opcional: Mostrar el email del usuario en la página
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
    }
});
