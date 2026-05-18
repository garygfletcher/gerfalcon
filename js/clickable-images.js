(function () {
    if (window.__gerfalconClickableImagesReady) {
        return;
    }

    window.__gerfalconClickableImagesReady = true;

    function openImageModal(imgSrc) {
        var imageModal = document.getElementById('imageModal');
        var modalImage = document.getElementById('modalImage');

        if (!imageModal || !modalImage || !imgSrc) {
            return;
        }

        modalImage.setAttribute('src', imgSrc);

        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
            window.jQuery(imageModal).modal('show');
            return;
        }

        imageModal.classList.add('show');
        imageModal.style.display = 'block';
        imageModal.removeAttribute('aria-hidden');
        document.body.classList.add('modal-open');

        var backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.setAttribute('data-clickable-image-backdrop', '');
        backdrop.addEventListener('click', closeImageModal);
        document.body.appendChild(backdrop);
    }

    function closeImageModal() {
        var imageModal = document.getElementById('imageModal');

        if (!imageModal) {
            return;
        }

        imageModal.classList.remove('show');
        imageModal.style.display = 'none';
        imageModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        document.querySelectorAll('[data-clickable-image-backdrop]').forEach(function (backdrop) {
            backdrop.remove();
        });
    }

    document.addEventListener('click', function (event) {
        if (event.defaultPrevented) {
            return;
        }

        if (event.target.closest('[data-dismiss="modal"]')) {
            closeImageModal();
            return;
        }

        var explicitTrigger = event.target.closest('[data-img-src]');
        if (explicitTrigger) {
            event.preventDefault();
            openImageModal(explicitTrigger.getAttribute('data-img-src'));
            return;
        }

        var image = event.target.closest('img');
        if (!image || image.id === 'modalImage' || image.closest('.navbar') || image.closest('.floating-social') || image.closest('.footer')) {
            return;
        }

        if (image.closest('a')) {
            return;
        }

        var src = image.currentSrc || image.getAttribute('src');
        if (!src) {
            return;
        }

        event.preventDefault();
        openImageModal(src);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeImageModal();
        }
    });
})();
