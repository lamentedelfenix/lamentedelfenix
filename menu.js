document.addEventListener('DOMContentLoaded', () => {

    // --- Inyectar el CSS para el enlace activo y las NUEVAS transiciones móviles ---
    const style = document.createElement('style');
    style.textContent = `
        .active-link { 
            color: #e91e63 !important; 
            border-bottom: 2px solid #e91e63; 
        }

        /* --- INICIO DE NUEVOS ESTILOS "WOW" --- */

        /* 1. Fondo del menú: con blur y animación de clip-path */
        #menu-links-mobile {
            /* Usamos clip-path para un 'reveal' suave de arriba a abajo */
            transition: clip-path 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            clip-path: inset(0 0 100% 0); /* (top right bottom left) - Se revela de arriba a abajo */
            
            /* Estilo de fondo: semitransparente con blur */
            /* Usamos el color de fondo de tu body (#fbf5e2) pero con transparencia */
            background: rgba(251, 245, 226, 0.9); 
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px); /* Soporte para Safari */
            
            /* Posicionamiento: lo sacamos del flow para que se superponga */
            /* Lo hacemos 'absolute' relativo al 'nav' (que ya es max-w-6xl mx-auto) */
            position: absolute;
            left: 0;
            right: 0;
            z-index: 40; /* Debajo de la barra de menú (que pondremos en z-index: 50) */
            
            /* Ajustes de layout */
            margin-top: 1rem; /* El 'mt-4' original */
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        #menu-links-mobile.menu-open {
            clip-path: inset(0 0 0% 0);
        }
        
        /* 2. Barra de menú: asegurar que esté por encima del blur */
        /* El <div> hijo directo del placeholder es el que contiene todo */
        #main-menu-placeholder > div { 
            position: relative;
            z-index: 50;
            /* El fondo blanco original del menú se mantiene en el 'header' del menú */
            background: white; 
            border-radius: 0.5rem; /* Asegurar que sea consistente */
        }

        /* 3. Animación del icono: rotación suave */
        #menu-toggle i {
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        #menu-toggle[aria-expanded="true"] i {
            transform: rotate(180deg);
        }

        /* 4. Animación de los enlaces: escalonados (staggered) */
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
        'bg-transparent', // Quitamos el fondo blanco de aquí
        'rounded-lg', 
        // 'shadow-md', // La sombra ahora la controla el <div> interno
        'p-0', // Quitamos el padding de aquí
        'max-w-6xl',
        'mx-auto',
        'relative' // Necesario para posicionar el menú desplegable
    );

    // --- Definir las páginas del menú ---
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // --- Lógica de detección de página activa ---
    const pathEnd = window.location.pathname.split('/').pop();

    // --- Estructura HTML del menú (con menú hamburguesa) ---
    // CAMBIO: Añadimos 'p-4' y 'shadow-md' al <div> interno
    let menuHTML = `
        <!-- Contenedor principal del nav (Header del menú) -->
        <div class="flex justify-between items-center p-4 shadow-md rounded-lg">
            
            <!-- Título "Menú" visible solo en móvil -->
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
    <!-- CAMBIO: Quitadas las clases de Tailwind de layout (mt-4, border-t, pt-4) -->
    <!-- ¡Ahora se controla todo por el CSS inyectado! -->
    <div id="menu-links-mobile" class="sm:hidden">
        <!-- CAMBIO: Añadido padding (p-6) al <ul> para espaciar los enlaces del borde -->
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

