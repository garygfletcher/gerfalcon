(function () {
    if (window.__gerfalconMobileNavReady) {
        return;
    }

    window.__gerfalconMobileNavReady = true;

    document.addEventListener('DOMContentLoaded', function () {
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.collapse) {
            return;
        }

        document.querySelectorAll('[data-toggle="collapse"][data-target]').forEach(function (button) {
            var target = document.querySelector(button.getAttribute('data-target'));
            if (!target) {
                return;
            }

            button.addEventListener('click', function () {
                var isOpen = target.classList.toggle('show');
                button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        });

        document.querySelectorAll('.navbar .dropdown-toggle').forEach(function (toggle) {
            toggle.addEventListener('click', function (event) {
                var dropdown = toggle.closest('.dropdown');
                var menu = dropdown ? dropdown.querySelector('.dropdown-menu') : null;

                if (!menu) {
                    return;
                }

                event.preventDefault();
                var isOpen = menu.classList.toggle('show');
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        });
    });
})();
