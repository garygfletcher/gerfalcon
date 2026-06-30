(function () {
    'use strict';

    function getVideoId(value) {
        if (!value) return '';

        try {
            var url = new URL(value, window.location.href);
            if (url.hostname.indexOf('youtu.be') !== -1) {
                return url.pathname.split('/').filter(Boolean)[0] || '';
            }

            if (url.pathname.indexOf('/embed/') === 0) {
                return url.pathname.split('/embed/')[1].split('/')[0] || '';
            }

            return url.searchParams.get('v') || '';
        } catch (error) {
            return '';
        }
    }

    function addStyles() {
        var style = document.createElement('style');
        style.textContent =
            '.youtube-modal-trigger{position:absolute;inset:0;width:100%;height:100%;padding:0;border:0;background:#000;cursor:pointer;overflow:hidden;color:#fff}' +
            '.youtube-modal-trigger img{width:100%;height:100%;object-fit:cover;opacity:.86;transition:opacity .2s ease,transform .2s ease}' +
            '.youtube-modal-trigger:hover img,.youtube-modal-trigger:focus img{opacity:1;transform:scale(1.015)}' +
            '.youtube-modal-trigger:focus-visible{outline:4px solid #f3c35a;outline-offset:3px}' +
            '.youtube-modal-play{position:absolute;left:50%;top:50%;width:78px;height:56px;border-radius:14px;background:#e62117;box-shadow:0 10px 28px rgba(0,0,0,.45);transform:translate(-50%,-50%)}' +
            '.youtube-modal-play:after{content:"";position:absolute;left:31px;top:16px;border-left:23px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent}' +
            '.youtube-movie-modal{position:fixed;inset:0;z-index:1080;display:none;align-items:center;justify-content:center;background:rgba(3,10,16,.9)}' +
            '.youtube-movie-modal.is-open{display:flex}' +
            '.youtube-movie-dialog{position:relative;width:90vw;height:90vh;display:flex;align-items:center;justify-content:center}' +
            '.youtube-movie-frame{width:100%;max-width:160vh;aspect-ratio:16/9;max-height:90vh;border:0;background:#000;box-shadow:0 28px 80px rgba(0,0,0,.65)}' +
            '.youtube-movie-close{position:absolute;z-index:1;right:0;top:0;width:46px;height:46px;border:1px solid rgba(255,255,255,.65);border-radius:50%;background:rgba(0,0,0,.78);color:#fff;font-size:32px;line-height:38px;cursor:pointer;transform:translate(35%,-35%)}' +
            '.youtube-movie-close:hover,.youtube-movie-close:focus{background:#b22822;outline:2px solid #fff}' +
            '@media(max-width:575.98px){.youtube-movie-dialog{width:90vw;height:90vh}.youtube-movie-close{right:2px;top:2px;transform:none}.youtube-modal-play{width:64px;height:46px}.youtube-modal-play:after{left:26px;top:13px;border-left-width:19px;border-top-width:10px;border-bottom-width:10px}}';
        document.head.appendChild(style);
    }

    function makeModal() {
        var modal = document.createElement('div');
        modal.className = 'youtube-movie-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'YouTube video player');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML =
            '<div class="youtube-movie-dialog">' +
                '<button class="youtube-movie-close" type="button" aria-label="Close video">&times;</button>' +
                '<iframe class="youtube-movie-frame" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
            '</div>';
        document.body.appendChild(modal);
        return modal;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var sources = document.querySelectorAll(
            'iframe[src*="youtube.com/embed/"], a[href*="youtube.com/watch"], a[href*="youtu.be/"]'
        );
        if (!sources.length) return;

        addStyles();
        var modal = makeModal();
        var frame = modal.querySelector('.youtube-movie-frame');
        var closeButton = modal.querySelector('.youtube-movie-close');
        var previousFocus = null;

        function openMovie(videoId) {
            previousFocus = document.activeElement;
            frame.src = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0';
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeButton.focus();
        }

        function closeMovie() {
            if (!modal.classList.contains('is-open')) return;
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            frame.src = '';
            document.body.style.overflow = '';
            if (previousFocus) previousFocus.focus();
        }

        Array.prototype.forEach.call(sources, function (source) {
            var videoId = getVideoId(source.getAttribute('src') || source.getAttribute('href'));
            if (!videoId) return;

            if (source.tagName === 'IFRAME') {
                var trigger = document.createElement('button');
                trigger.type = 'button';
                trigger.className = 'youtube-modal-trigger';
                trigger.setAttribute('aria-label', source.title || 'Play YouTube video');
                trigger.innerHTML =
                    '<img src="https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg" alt="">' +
                    '<span class="youtube-modal-play" aria-hidden="true"></span>';
                trigger.addEventListener('click', function () { openMovie(videoId); });
                source.parentNode.replaceChild(trigger, source);
            } else {
                source.removeAttribute('target');
                source.addEventListener('click', function (event) {
                    event.preventDefault();
                    openMovie(videoId);
                });
            }
        });

        closeButton.addEventListener('click', closeMovie);
        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeMovie();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMovie();
        });
    });
})();
