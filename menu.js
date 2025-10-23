document.addEventListener('DOMContentLoaded', () => {
    // 1. Encontrar el lugar donde irá el menú
    const menuPlaceholder = document.getElementById('main-menu-placeholder');
    if (!menuPlaceholder) {
        console.error('Elemento #main-menu-placeholder no encontrado. El menú no se puede cargar.');
        return;
    }

    // 2. Definir las páginas del menú
    const menuItems = [
        { href: 'index.html', text: 'Inicio' },
        { href: 'psicoterapia.html', text: 'Psicoterapia' },
        { href: 'membresia.html', text: 'Membresía' }
    ];

    // 3. Obtener la página actual para saber cuál enlace marcar como "activo"
    // Obtenemos la última parte de la URL (ej. "index.html" o "membresia.html")
    const pathParts = window.location.pathname.split('/');
    const currentPage = pathParts.pop() || (pathParts.pop() || 'index.html'); // Maneja casos como "/" o "/pagina/"

    // 4. Construir el HTML del menú
    let menuHTML = `
        <ul class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-10 p-4">
    `;

    // 5. Añadir los enlaces normales (Inicio, Psicoterapia, Membresía)
    menuItems.forEach(item => {
        // Comprobar si el href del item coincide con la página actual
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
    // Usamos exactamente las clases que me pediste para mantener el efecto y color
    menuHTML += `
        <li class="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 flex justify-center">
            <a href="./login.html" 
               class="animated-login-button inline-block py-4 px-10 text-xl font-bold rounded-full text-white">
                Acceso Miembros
            </a>
        </li>
    `;

    menuHTML += `</ul>`;

    // 7. Insertar el HTML construido en la página
    menuPlaceholder.innerHTML = menuHTML;
});
