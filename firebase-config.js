// Importa las funciones que necesitas de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- IMPORTANTE: Usa la configuración de tu NUEVO proyecto de Firebase ---
// Tu configuración web del proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBbA-qi5YMot_55vqQ2KbocDwNMT8RNZ6Q",
    authDomain: "membresia-ucdm-v2.firebaseapp.com",
    projectId: "membresia-ucdm-v2",
    storageBucket: "membresia-ucdm-v2.firebasestorage.app",
    messagingSenderId: "198704348819",
    appId: "1:198704348819:web:4f52c9acf6cad3583e5766",
    measurementId: "G-5L3T8PGXYK"
};

// Inicializa Firebase UNA SOLA VEZ
const app = initializeApp(firebaseConfig);

// Exporta las instancias de los servicios para que otras páginas las puedan usar
export const auth = getAuth(app);
export const db = getFirestore(app);
