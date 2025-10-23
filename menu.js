document.addEventListener('DOMContentLoaded', () => {
    // 1. Encontrar el lugar donde irá el menú
    const menuPlaceholder = document.getElementById('main-menu-placeholder');
    if (!menuPlaceholder) {
        console.error('Elemento #main-menu-placeholder no encontrado. El menú no se puede cargar.');
        return;
    }

    // ****** CAMBIO VISUAL 1: FONDO BLANCO ******
    // Esto convierte el menú en una barra de navegación con fondo blanco, sombra y padding.
    menuPlaceholder.classList.add(
        'bg-white',       // Fondo blanco
        'rounded-lg',     // Bordes redondeados
        'shadow-md',      // Sombra suave
        'p-4',            // Padding interno
        'max-w-4xl',      // Limitamos el ancho para que coincida con el contenido
        'mx-auto'         // Centramos la barra
    );
    // **********************************

    // 2. Definir las páginas del menú
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // 3. Obtener la página actual para saber cuál enlace marcar como "activo"
    const pathParts = window.location.pathname.split('/');
    const currentPage = pathParts.pop() || (pathParts.pop() || 'index.html'); 

    // 4. Construir el HTML del menú
    let menuHTML = `
        <ul class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-10">
    `;

    // 5. Añadir los enlaces normales (Inicio, Psicoterapia, Membresía)
    menuItems.forEach(item => {
        const isActive = currentPage === item.href;
        
        menuHTML += `
            <li>
                <a href="./${item.href}" 
                   class="text-xl font-semibold text-gray-700 hover:text-brand-pink transition-colors duration-300 pb-1 ${isActive ? 'active-link' : ''}">
                    ${item.text}
                </a>
            </li>
        `;
    });

    // 6. Añadir el botón especial de "Acceso Miembros" al final
    menuHTML += `
        <li class="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 flex justify-center">
            <!-- ****** CAMBIO VISUAL 2: BOTÓN MÁS PEQUEÑO ****** -->
            <!-- He reducido el padding (py-2 px-5), el grosor de la fuente (font-semibold) y el redondeo (rounded-lg) -->
            <a href="./login.html" 
               class="animated-login-button inline-block py-2 px-5 text-xl font-semibold rounded-lg text-white">
                Acceso Miembros
            </a>
        </li>
    `;

    menuHTML += `</ul>`;

    // 7. Insertar el HTML construido en la página
    menuPlaceholder.innerHTML = menuHTML;
});

