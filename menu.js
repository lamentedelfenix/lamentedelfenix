document.addEventListener('DOMContentLoaded', () => {

    // --- ARREGLO 1: Inyectar el CSS para el enlace activo ---
    // (Esto estaba bien, pero el ARREGLO 3 lo hace funcionar)
    const style = document.createElement('style');
    style.textContent = `
        .active-link { 
            color: #e91e63 !important; 
            border-bottom: 2px solid #e91e63; 
        }
    `;
    document.head.appendChild(style);

    // --- ARREGLO 2: Crear el <nav> dinámicamente ---
    const header = document.querySelector('header');
    if (!header) {
        console.error('<header> no encontrado. El menú no se puede insertar.');
        return;
    }
    const navMenu = document.createElement('nav');

    // --- CAMBIO VISUAL (ANCHO): Ajustado a 'max-w-6xl' ---
    // Ahora el menú tendrá el mismo ancho que tu banner (max-w-6xl)
    // Esto debería solucionar el problema del fondo blanco que no veías en escritorio.
    navMenu.classList.add(
        'bg-white',       // Fondo blanco
        'rounded-lg',     // Bordes redondeados
        'shadow-md',      // Sombra suave
        'p-4',            // Padding interno
        'max-w-6xl',      // <-- CAMBIADO DE 4xl a 6xl
        'mx-auto',        // Centramos
        'mb-8'            // Margen inferior
    );

    // 4. Definir las páginas del menú
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // --- ARREGLO 3 (PÁGINA ACTIVA): Lógica de detección de página ---
    // Esta nueva lógica es mucho más robusta y SÍ detectará la página activa.
    const currentPath = window.location.pathname;

    // 6. Construir el HTML del menú
    let menuHTML = `
        <!-- --- ARREGLO 4 (MÓVIL): Menú responsive --- -->
        <!-- Cambiado de 'flex-col sm:flex-row' a 'flex-row flex-wrap' -->
        <!-- Esto hace que los items fluyan horizontalmente en móvil en lugar de apilarse -->
        <ul class="flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-4 sm:gap-x-10">
    `;

    // 7. Añadir los enlaces normales
    menuItems.forEach(item => {
        // --- Lógica de 'isActive' mejorada ---
        const isActive = currentPath.endsWith(item.href) || 
                         (currentPath.endsWith('/') && item.href === 'index.html');
        
        menuHTML += `
            <li>
                <a href="./${item.href}" 
                   class="text-xl font-semibold text-gray-700 hover:text-brand-pink transition-colors duration-300 pb-1 ${isActive ? 'active-link' : ''}">
                    ${item.text}
                </a>
            </li>
        `;
    });

    // 8. Añadir el botón especial de "Acceso Miembros"
    menuHTML += `
        <li class="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 flex justify-center">
            <a href="./login.html" 
               class="animated-login-button inline-flex items-center py-1.5 px-4 text-lg font-semibold rounded-md text-white">
                <i class="fas fa-key mr-2 text-sm"></i>
                <span>Acceso Miembros</span>
            </a>
        </li>
    `;

    menuHTML += `</ul>`;

    // 9. Insertar el HTML construido en el <nav>
    navMenu.innerHTML = menuHTML;

    // 10. Insertar el <nav> completo en la página, DESPUÉS del <header>
    header.parentNode.insertBefore(navMenu, header.nextSibling);
});

