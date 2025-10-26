document.addEventListener('DOMContentLoaded', () => {

    // --- Inyectar el CSS para el enlace activo ---
    // (Esto estaba bien y se mantiene)
    const style = document.createElement('style');
    style.textContent = `
        .active-link { 
            color: #e91e63 !important; 
            border-bottom: 2px solid #e91e63; 
        }
        /* --- MEJORA MÓVIL: Transición para el menú desplegable --- */
        #menu-links-mobile {
            transition: all 0.3s ease-in-out;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // --- Obtener el <header> ---
    const header = document.querySelector('header');
    if (!header) {
        console.error('<header> no encontrado. El menú no se puede insertar.');
        return;
    }

    // --- Crear el <nav> dinámicamente ---
    const navMenu = document.createElement('nav');
    navMenu.classList.add(
        'bg-white', 
        'rounded-lg', 
        'shadow-md', 
        'p-4',         // Padding interno
        'max-w-6xl',   // Ancho máximo
        'mx-auto',     // Centramos
        'mb-8'         // Margen inferior
    );

    // --- Definir las páginas del menú ---
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // --- Lógica de detección de página activa ---
    // (Tu lógica estaba correcta y se mantiene)
    const currentPath = window.location.pathname;

    // --- MEJORA MÓVIL: Nueva estructura HTML con menú hamburguesa ---
    let menuHTML = `
        <!-- Contenedor principal del nav (Header del menú) -->
        <div class="flex justify-between items-center">
            
            <!-- Título "Menú" visible solo en móvil -->
            <span class="text-xl font-semibold text-gray-800 sm:hidden">Menú</span>
            
            <!-- Botón Hamburger (visible solo en móvil) -->
            <button id="menu-toggle" aria-label="Abrir menú" class="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-pink">
                <!-- Asumo que FontAwesome está cargado (basado en tu botón de login) -->
                <i class="fas fa-bars text-2xl"></i> 
            </button>
            
            <!-- Menú de ESCRITORIO (oculto en móvil, visible desde sm) -->
            <ul id="menu-list-desktop" class="hidden sm:flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-4 sm:gap-x-10">
    `;

    // --- Añadir los enlaces al MENÚ DE ESCRITORIO ---
    menuItems.forEach(item => {
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

    // --- Añadir el botón "Acceso Miembros" al MENÚ DE ESCRITORIO ---
    menuHTML += `
            <li class="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 flex justify-center sm:justify-start">
                <a href="./login.html" 
                   class="animated-login-button inline-flex items-center py-1.5 px-4 text-lg font-semibold rounded-md text-white">
                   <i class="fas fa-key mr-2 text-sm"></i>
                   <span>Acceso Miembros</span>
                </a>
            </li>
        </ul> <!-- Fin de #menu-list-desktop -->
    </div> <!-- Fin del header del menú -->

    <!-- --- MEJORA MÓVIL: Menú Desplegable (oculto por defecto y en pantallas >sm) --- -->
    <div id="menu-links-mobile" class="hidden sm:hidden mt-4 border-t border-gray-200 pt-4">
        <ul class="flex flex-col items-center gap-y-4">
    `;

    // --- Añadir los enlaces al MENÚ MÓVIL ---
    // (Los duplicamos para tener un control limpio del layout)
    menuItems.forEach(item => {
        const isActive = currentPath.endsWith(item.href) || 
                         (currentPath.endsWith('/') && item.href === 'index.html');
        
        menuHTML += `
            <li>
                <a href="./${item.href}" 
                   class="block w-full text-center text-xl font-semibold text-gray-700 hover:text-brand-pink transition-colors duration-300 py-2 ${isActive ? 'active-link' : ''}">
                   ${item.text}
                </a>
            </li>
        `;
    });

    // --- Añadir el botón "Acceso Miembros" al MENÚ MÓVIL ---
    menuHTML += `
            <li class="w-full mt-4 flex justify-center">
                <a href="./login.html" 
                   class="animated-login-button inline-flex items-center py-1.5 px-4 text-lg font-semibold rounded-md text-white">
                   <i class="fas fa-key mr-2 text-sm"></i>
                   <span>Acceso Miembros</span>
                </a>
            </li>
        </ul>
    </div>
    `;

    // 9. Insertar el HTML construido en el <nav>
    navMenu.innerHTML = menuHTML;

    // 10. Insertar el <nav> completo en la página, DESPUÉS del <header>
    header.parentNode.insertBefore(navMenu, header.nextSibling);

    // --- LÓGICA HAMBURGER (NUEVO) ---
    // Obtenemos los elementos DESPUÉS de que han sido añadidos al DOM
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinksMobile = document.getElementById('menu-links-mobile');
    
    if (menuToggle && menuLinksMobile) {
        menuToggle.addEventListener('click', () => {
            // Muestra u oculta el menú
            menuLinksMobile.classList.toggle('hidden');
            
            // Cambia el icono de barras a 'X' y viceversa
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (menuLinksMobile.classList.contains('hidden')) {
                    icon.classList.remove('fa-times'); // Icono 'X'
                    icon.classList.add('fa-bars');   // Icono 'hamburguesa'
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    menuToggle.setAttribute('aria-label', 'Cerrar menú');
                }
            }
        });
    }
});
