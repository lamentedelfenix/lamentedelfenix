document.addEventListener('DOMContentLoaded', () => {

    // --- Inyectar el CSS para el enlace activo ---
    const style = document.createElement('style');
    style.textContent = `
        .active-link { 
            color: #e91e63 !important; 
            font-weight: 700 !important;
            border-bottom: 2px solid #e91e63; 
        }
        #menu-links-mobile {
            transition: all 0.3s ease-in-out;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // --- CORRECCIÓN: Obtener el <nav> PLACEHOLDER existente ---
    // En lugar de crear un <nav> nuevo, usamos el que ya está en tu HTML.
    const navMenu = document.getElementById('main-menu-placeholder');
    if (!navMenu) {
        console.error('#main-menu-placeholder no encontrado. El menú no se puede insertar.');
        return;
    }

    // --- Aplicar clases de estilo al placeholder ---
    // 'mb-8' ya está en el HTML, pero añadimos el resto para que tenga el fondo blanco.
    navMenu.classList.add(
        'bg-white', 
        'rounded-lg', 
        'shadow-md', 
        'p-4',
        'max-w-6xl',
        'mx-auto'
    );

    // --- Definir las páginas del menú ---
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // --- CORRECCIÓN 1 (Revisada): Lógica de página activa MÁS ROBUSTA ---
    // Maneja casos como '/', '/pagina.html' y '/pagina.html/'
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(part => part.trim() !== ''); // Filtra strings vacíos
    
    // Obtiene el último elemento (ej. 'membresia.html') o 'index.html' si está vacío (es la raíz)
    let currentFile = pathParts.pop() || 'index.html';

    // Asegurarse de que si es un archivo, tenga la extensión .html para comparar
    // Esto es por si acaso el servidor omite las extensiones
    if (currentFile !== 'index.html' && !currentFile.endsWith('.html')) {
         // Esto es una suposición; si las URLs son limpias (sin .html), necesitaríamos otra lógica.
         // Pero basándonos en los archivos, los enlaces SÍ tienen .html
         // Si la lógica falla, podría ser por esto.
         // De momento, la lógica simple es la mejor:
         currentFile = pathParts.pop() || 'index.html';
    }
    
    // --- CORRECCIÓN 2: Centrado en Escritorio (sm:justify-center) ---
    // Añadimos 'flex-wrap' para robustez y 'sm:justify-center' para centrar
    // el menú de escritorio.
    let menuHTML = `
        <div class="flex flex-wrap justify-between sm:justify-center items-center">
            
            <!-- Título "Menú" visible solo en móvil -->
            <span class="text-xl font-semibold text-gray-800 sm:hidden">Menú</span>
            
            <!-- Botón Hamburger (visible solo en móvil) -->
            <button id="menu-toggle" aria-label="Abrir menú" class="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-pink">
                <i class="fas fa-bars text-2xl"></i> 
            </button>
            
            <!-- Menú de ESCRITORIO (oculto en móvil, visible desde sm) -->
            <ul id="menu-list-desktop" class="hidden sm:flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-4 sm:gap-x-10">
    `;

    // --- Añadir los enlaces al MENÚ DE ESCRITORIO ---
    menuItems.forEach(item => {
        // --- CORRECCIÓN 1 (Revisada, continuación) ---
        // Compara directamente el href del item con el archivo actual.
        const isActive = (item.href === currentFile);
        
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

    <!-- --- Menú Desplegable Móvil --- -->
    <div id="menu-links-mobile" class="hidden sm:hidden mt-4 border-t border-gray-200 pt-4">
        <ul class="flex flex-col items-center gap-y-4">
    `;

    // --- Añadir los enlaces al MENÚ MÓVIL ---
    menuItems.forEach(item => {
        // --- CORRECCIÓN 1 (Revisada, continuación) ---
        // Compara directamente el href del item con el archivo actual.
        const isActive = (item.href === currentFile);
        
        menuHTML += `
            <li>
                <a href="./${item.href}" 
                   class="block w-full text-center text-xl font-semibold text-gray-700 hover:text-brand-pink transition-colors duration-300 py-2 ${isActive ? 'active-link' : ''}">
                   ${item.text}
                </a>
            </li>
        `;
    });

    // --- CORRECCIÓN 3: Añadir el botón "Acceso Miembros" al MENÚ MÓVIL ---
    // Este botón ahora se renderizará correctamente porque el script
    // usa el <nav> correcto y las clases CSS de tus HTML se aplicarán.
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

    // --- CORRECCIÓN: Insertar el HTML en el placeholder existente ---
    navMenu.innerHTML = menuHTML;

    // --- LÓGICA HAMBURGER (Esto ya estaba bien) ---
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

