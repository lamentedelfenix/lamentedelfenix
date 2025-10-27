document.addEventListener('DOMContentLoaded', () => {

    // --- Inyectar el CSS para el enlace activo y transiciones móviles ---
    const style = document.createElement('style');
    style.textContent = `
        .active-link { 
            color: #e91e63 !important; 
            border-bottom: 2px solid #e91e63; 
        }
        /* Transición para el menú desplegable */
        #menu-links-mobile {
            transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
            overflow: hidden;
            max-height: 0;
            opacity: 0;
        }
        #menu-links-mobile.menu-open {
            max-height: 500px; /* Altura suficiente para los enlaces */
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // --- Obtener el <nav> placeholder ---
    const navPlaceholder = document.getElementById('main-menu-placeholder');
    if (!navPlaceholder) {
        console.error('#main-menu-placeholder no encontrado. El menú no se puede insertar.');
        return;
    }

    // --- Añadir las clases de estilo al placeholder existente ---
    navPlaceholder.classList.add(
        'bg-white', 
        'rounded-lg', 
        'shadow-md', 
        'p-4',         // Padding interno
        'max-w-6xl',   // Ancho máximo
        'mx-auto'      // Centramos
    );

    // --- Definir las páginas del menú ---
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // --- Lógica de detección de página activa ---
    // Obtenemos la última parte de la URL (ej: "psicoterapia.html", "psicoterapia", "index.html", o "")
    const pathEnd = window.location.pathname.split('/').pop();

    // --- Estructura HTML del menú (con menú hamburguesa) ---
    let menuHTML = `
        <!-- Contentor principal del nav (Header del menú) -->
        <div class="flex justify-between items-center">
            
            <!-- Título "Menú" visible solo en móvil - CORREGIDO: "classid" a "id" -->
            <span id="menu-title-mobile" class="text-xl font-semibold text-gray-800 sm:hidden">Menú</span>
            
            <!-- Botón Hamburger (visible solo en móvil) -->
            <button id="menu-toggle" aria-label="Abrir menú" aria-expanded="false" class="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500">
                <i class="fas fa-bars text-2xl"></i> 
            </button>
            
            <!-- Menú de ESCRITORIO (oculto en móvil, visible desde sm) -->
            <ul id="menu-list-desktop" class="hidden sm:flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-4 sm:gap-x-10 flex-grow">
    `;

    // --- Añadir los enlaces al MENÚ DE ESCRITORIO ---
    menuItems.forEach(item => {
        // LÓGICA DE PÁGINA ACTIVA CORREGIDA Y ROBUSTA:
        // 1. Compara si la URL termina en "pagina.html"
        // 2. Compara si la URL termina en "pagina" (sin .html)
        // 3. Compara si la URL está vacía ("") y el enlace es "index.html"
        const isActive = (pathEnd === item.href) ||
                         (pathEnd === item.href.replace('.html', '')) ||
                         (pathEnd === '' && item.href === 'index.html');
        
        menuHTML += `
            <li>
                <a href="./${item.href}" 
                   class="text-lg md:text-xl font-semibold text-gray-700 hover:text-pink-600 transition-colors duration-300 pb-1 ${isActive ? 'active-link' : ''}">
                   ${item.text}
                </a>
            </li>
        `;
    });

    // --- Añadir el botón "Acceso Miembros" al MENÚ DE ESCRITORIO ---
    menuHTML += `
            <li class="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 flex justify-center sm:justify-start">
                <a href="https://lamentedelfenix.com/login" 
                   class="animated-login-button inline-flex items-center py-1.5 px-4 text-lg font-semibold rounded-md text-white">
                   <i class="fas fa-key mr-2 text-sm"></i>
                   <span>Acceso Miembros</span>
                </a>
            </li>
        </ul> <!-- Fin de #menu-list-desktop -->
    </div> <!-- Fin del header del menú -->

    <!-- --- Menú Desplegable MÓVIL (oculto por defecto y en pantallas >sm) --- -->
    <div id="menu-links-mobile" class="sm:hidden mt-4 border-t border-gray-200 pt-4">
        <ul class="flex flex-col items-center gap-y-4">
    `;

    // --- Añadir los enlaces al MENÚ MÓVIL ---
    menuItems.forEach(item => {
        // LÓGICA DE PÁGINA ACTIVA CORREGIDA Y ROBUSTA:
        const isActive = (pathEnd === item.href) ||
                         (pathEnd === item.href.replace('.html', '')) ||
                         (pathEnd === '' && item.href === 'index.html');
        
        menuHTML += `
            <li>
                <a href="./${item.href}" 
                   class="block w-full text-center text-xl font-semibold text-gray-700 hover:text-pink-600 transition-colors duration-300 py-2 ${isActive ? 'active-link' : ''}">
                   ${item.text}
                </a>
            </li>
        `;
    });

    // --- Añadir el botón "Acceso Miembros" al MENÚ MÓVIL ---
    menuHTML += `
            <li class="w-full mt-4 flex justify-center">
                <a href="https://lamentedelfenix.com/login" 
                   class="animated-login-button inline-flex items-center py-1.5 px-4 text-lg font-semibold rounded-md text-white">
                   <i class="fas fa-key mr-2 text-sm"></i>
                   <span>Acceso Miembros</span>
                </a>
            </li>
        </ul>
    </div>
    `;

    // 9. Insertar el HTML construido en el <nav> placeholder
    navPlaceholder.innerHTML = menuHTML;

    // --- LÓGICA HAMBURGER ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinksMobile = document.getElementById('menu-links-mobile');
    // CORREGIDO: Ahora 'menu-title-mobile' se encontrará correctamente
    const menuTitleMobile = document.getElementById('menu-title-mobile'); 
    
    if (menuToggle && menuLinksMobile) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuLinksMobile.classList.toggle('menu-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (isOpen) {
                    icon.classList.remove('fa-bars');   // Icono 'hamburguesa'
                    icon.classList.add('fa-times'); // Icono 'X'
                    menuToggle.setAttribute('aria-label', 'Cerrar menú');
                    if(menuTitleMobile) menuTitleMobile.textContent = "Navegación"; // Cambia el título
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                    if(menuTitleMobile) menuTitleMobile.textContent = "Menú"; // Restaura el título
                }
            }
        });
    }
});

