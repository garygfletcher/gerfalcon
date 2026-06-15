(function () {
    if (window.__gerfalconClickableImagesReady) {
        return;
    }

    window.__gerfalconClickableImagesReady = true;

    var galleryItems = [];
    var currentIndex = -1;

    function refreshGalleryItems() {
        galleryItems = Array.prototype.slice.call(document.querySelectorAll('[data-img-src]')).filter(function (trigger) {
            return trigger.getAttribute('data-img-src');
        });
    }

    function modalIsOpen(imageModal) {
        return imageModal && (imageModal.classList.contains('show') || imageModal.style.display === 'block');
    }

    function setModalImage(index) {
        var modalImage = document.getElementById('modalImage');
        var modalTitle = document.getElementById('imageModalLabel');
        var baseTitle = 'Image';
        var trigger;
        var image;
        var imgSrc;

        if (!modalImage || !galleryItems.length) {
            return;
        }

        currentIndex = (index + galleryItems.length) % galleryItems.length;
        trigger = galleryItems[currentIndex];
        imgSrc = trigger.getAttribute('data-img-src');

        if (!imgSrc) {
            return;
        }

        modalImage.setAttribute('src', imgSrc);
        image = trigger.querySelector('img');

        if (modalTitle) {
            baseTitle = modalTitle.getAttribute('data-modal-base-title') || modalTitle.textContent || baseTitle;
            modalTitle.setAttribute('data-modal-base-title', baseTitle);
        }

        modalImage.setAttribute('alt', image ? (image.getAttribute('alt') || baseTitle) : baseTitle);

        if (modalTitle) {
            modalTitle.textContent = baseTitle + (galleryItems.length > 1 ? ' (' + (currentIndex + 1) + ' of ' + galleryItems.length + ')' : '');
        }
    }

    function openImageModal(imgSrc) {
        var imageModal = document.getElementById('imageModal');
        var index;

        if (!imageModal || !imgSrc) {
            return;
        }

        refreshGalleryItems();
        index = galleryItems.findIndex(function (trigger) {
            return trigger.getAttribute('data-img-src') === imgSrc;
        });

        if (index === -1) {
            galleryItems.push({
                getAttribute: function () { return imgSrc; },
                querySelector: function () { return null; }
            });
            index = galleryItems.length - 1;
        }

        setModalImage(index);

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

    function showAdjacentImage(step) {
        if (!galleryItems.length || currentIndex === -1) {
            return;
        }

        setModalImage(currentIndex + step);
    }

    function closeImageModal() {
        var imageModal = document.getElementById('imageModal');

        if (!imageModal) {
            return;
        }

        currentIndex = -1;
        imageModal.classList.remove('show');
        imageModal.style.display = 'none';
        imageModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        document.querySelectorAll('[data-clickable-image-backdrop]').forEach(function (backdrop) {
            backdrop.remove();
        });
    }

    document.addEventListener('click', function (event) {
        var explicitTrigger = event.target.closest('[data-img-src]');
        if (explicitTrigger) {
            event.preventDefault();
            event.stopPropagation();
            openImageModal(explicitTrigger.getAttribute('data-img-src'));
        }
    }, true);

    document.addEventListener('click', function (event) {
        if (event.defaultPrevented) {
            return;
        }

        if (event.target.closest('[data-dismiss="modal"]')) {
            closeImageModal();
            return;
        }

        if (event.target.closest('[data-image-modal-prev]')) {
            event.preventDefault();
            showAdjacentImage(-1);
            return;
        }

        if (event.target.closest('[data-image-modal-next]')) {
            event.preventDefault();
            showAdjacentImage(1);
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
        var imageModal = document.getElementById('imageModal');

        if (event.key === 'Escape') {
            closeImageModal();
            return;
        }

        if (!modalIsOpen(imageModal)) {
            return;
        }

        if (event.key === 'ArrowLeft' || event.key === 'Left') {
            event.preventDefault();
            showAdjacentImage(-1);
            return;
        }

        if (event.key === 'ArrowRight' || event.key === 'Right') {
            event.preventDefault();
            showAdjacentImage(1);
        }
    });
})();
