// Appliquer le thème immédiatement pour éviter le flash de contenu
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
}

// Gestion du thème sombre/clair
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Changer le thème');
    themeToggle.innerHTML = document.documentElement.classList.contains('dark-theme') ? '☀️' : '🌙';
    document.body.appendChild(themeToggle);

    // Gérer le clic sur le bouton
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-theme');
        const isDark = document.documentElement.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    });
}); 