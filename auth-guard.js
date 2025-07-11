// --- CAMBIO CLAVE: Importar 'auth' desde el archivo de configuración central ---
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- ELIMINADO: Ya no se necesita la configuración ni inicializar la app aquí ---
// const firebaseConfig = { ... };
// const app = initializeApp(firebaseConfig);

// Esta función estará disponible en tus páginas para poder cerrar sesión
// (Se ha movido a miembros.html para que solo se defina una vez)
// window.handleLogout = function() { ... }

onAuthStateChanged(auth, (user) => {
    const body = document.querySelector('body');
    
    // Lista de páginas públicas que no necesitan autenticación
    const publicPages = ['/login.html', '/registro.html'];
    const currentPage = window.location.pathname;

    if (user) {
        // El usuario está autenticado. Mostramos el contenido de la página.
        if (body) {
            body.style.opacity = '1';
            body.style.visibility = 'visible';
        }
    } else {
        // Si no hay usuario y la página actual NO es una de las públicas, redirigir al login.
        if (!publicPages.some(page => currentPage.includes(page))) {
            console.log('Usuario no autenticado. Redirigiendo a login...');
            window.location.href = './login.html';
        } else {
            // Si ya está en una página pública, simplemente muestra el contenido.
             if (body) {
                body.style.opacity = '1';
                body.style.visibility = 'visible';
            }
        }
    }
});
