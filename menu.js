document.addEventListener('DOMContentLoaded', () => {

    // --- Inyectar el CSS para el enlace activo y las NUEVAS transiciones móviles ---
    const style = document.createElement('style');
    style.textContent = `
        .active-link { 
            color: #e91e63 !important; 
            border-bottom: 2px solid #e91e63; 
        }

        /* --- INICIO DE NUEVOS ESTILOS (VERSIÓN PUSH-DOWN) --- */

        /* 1. Fondo del menú: Animación con max-height para empujar el contenido */
        #menu-links-mobile {
            /* Usamos max-height para la animación de apertura/cierre */
            transition: max-height 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            max-height: 0; /* Colapsado por defecto */
            overflow: hidden; /* ¡Importante para que max-height funcione! */
            
            /* Estilo: fondo blanco, ya no es 'absolute' */
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            
            /* Esta es la separación entre la barra de menú y el desplegable */
            /* Se colapsará a 0 junto con max-height */
            margin-top: 1rem; 
        }
        
        #menu-links-mobile.menu-open {
            max-height: 500px; /* Altura suficiente para mostrar los enlaces */
        }
        
        /* 2. Barra de menú: El 'header' del menú */
        #main-menu-placeholder > div > div:first-child { 
            /* El fondo blanco y la sombra están en la barra superior */
            /* Aplicado al div:first-child para que el div.mb-8 no lo coja */
            background: white; 
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            position: relative; /* Para el z-index */
            z-index: 50; /* Asegura que esté sobre el desplegable si se solapan */
        }

        /* 3. Animación del icono: rotación suave (Se mantiene) */
        #menu-toggle i {
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        #menu-toggle[aria-expanded="true"] i {
            transform: rotate(180deg);
        }

        /* 4. Animación de los enlaces: escalonados (Se mantiene) */
        #menu-links-mobile li {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        
        #menu-links-mobile.menu-open li {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        
        /* El delay para el efecto escalonado */
        #menu-links-mobile.menu-open li:nth-child(1) { transition-delay: 0.1s; }
        #menu-links-mobile.menu-open li:nth-child(2) { transition-delay: 0.15s; }
        #menu-links-mobile.menu-open li:nth-child(3) { transition-delay: 0.2s; }
        #menu-links-mobile.menu-open li:nth-child(4) { transition-delay: 0.25s; }
        
        /* --- FIN DE NUEVOS ESTILOS --- */
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
        'bg-transparent', 
        'rounded-lg', 
        'p-0', 
        'max-w-6xl',
        'mx-auto'
    );
    navPlaceholder.classList.remove('mb-8');


    // --- Definir las páginas del menú ---
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // --- Lógica de detección de página activa ---
    const pathEnd = window.location.pathname.split('/').pop();

    // --- Estructura HTML del menú (con menú hamburguesa) ---
    let menuHTML = `
        <!-- Contenedor principal del nav (Header del menú) -->
        <div class="mb-8"> 
            <!-- CAMBIO: Padding 'p-4' cambiado a 'py-2 px-4' para simetría -->
            <div class="flex justify-between items-center py-2 px-4 rounded-lg">
                
                <!-- Título "Menú" visible solo en móvil -->
                <span id="menu-title-mobile" class="text-xl font-semibold text-gray-800 sm:hidden">Menú</span>
                
                <!-- NUEVO: Contenedor para botones derechos (solo móvil) -->
                <div class="sm:hidden flex items-center gap-2">
                    
                    <!-- NUEVO: Botón de Llave (Icono) -->
                    <a href="https://lamentedelfenix.com/login" 
                       class="animated-login-button inline-flex items-center justify-center w-10 h-10 p-2 rounded-md text-white"
                       aria-label="Acceso Miembros">
                       <i class="fas fa-key text-lg"></i>
                    </a>

                    <!-- Botón Hamburger (Movido aquí) -->
                    <button id="menu-toggle" aria-label="Abrir menú" aria-expanded="false" class="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500">
                        <i class="fas fa-bars text-2xl"></i> 
                    </button>
                </div>
                
                <!-- Menú de ESCRITORIO (oculto en móvil, visible desde sm) -->
                <ul id="menu-list-desktop" class="hidden sm:flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-4 sm:gap-x-10 flex-grow">
    `;

    // --- Añadir los enlaces al MENÚ DE ESCRITORIO ---
    menuItems.forEach(item => {
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

    <!-- --- Menú Desplegable MÓVIL --- -->
    <div id="menu-links-mobile" class="sm:hidden">
        <ul class="flex flex-col items-center gap-y-4 p-6">
    `;

    // --- Añadir los enlaces al MENÚ MÓVIL ---
    menuItems.forEach(item => {
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

    // --- Añadir el botón "Acceso Miembros" al MENÚ MÓVIL (Se mantiene) ---
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
    
    </div> <!-- Cierre del <div> que envuelve todo (el que tiene mb-8) -->
    `;

    // 9. Insertar el HTML construido en el <nav> placeholder
    navPlaceholder.innerHTML = menuHTML;

    // --- LÓGICA HAMBURGER (Sin cambios, solo activa/desactiva la clase .menu-open) ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinksMobile = document.getElementById('menu-links-mobile');
    const menuTitleMobile = document.getElementById('menu-title-mobile'); 
    
    if (menuToggle && menuLinksMobile) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuLinksMobile.classList.toggle('menu-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (isOpen) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    menuToggle.setAttribute('aria-label', 'Cerrar menú');
                    if(menuTitleMobile) menuTitleMobile.textContent = "Navegación";
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                    if(menuTitleMobile) menuTitleMobile.textContent = "Menú";
                }
            }
        });
    }
});

