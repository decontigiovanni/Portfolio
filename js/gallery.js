// Griglia thumbnail + lightbox accessibile per le schede progetto con più immagini
// (BrandMR, Telefono Terminale). Dipende da GALLERY_PROJECTS in js/gallery-data.js.
// Nessuna libreria esterna: solo DOM + GSAP, già caricato da portfolio.html.
(function () {
    "use strict";

    function buildPicture(project, image, opts) {
        opts = opts || {};
        var sizes = opts.sizes || "(max-width: 640px) 45vw, 220px";
        var loading = opts.loading || "lazy";
        var basePath = project.basePath;
        var avifSrcset = project.widths
            .map(function (w) { return basePath + image.file + "-" + w + ".avif " + w + "w"; })
            .join(", ");
        var webpSrcset = project.widths
            .map(function (w) { return basePath + image.file + "-" + w + ".webp " + w + "w"; })
            .join(", ");

        var picture = document.createElement("picture");

        var sourceAvif = document.createElement("source");
        sourceAvif.type = "image/avif";
        sourceAvif.srcset = avifSrcset;
        sourceAvif.sizes = sizes;
        picture.appendChild(sourceAvif);

        var sourceWebp = document.createElement("source");
        sourceWebp.type = "image/webp";
        sourceWebp.srcset = webpSrcset;
        sourceWebp.sizes = sizes;
        picture.appendChild(sourceWebp);

        var img = document.createElement("img");
        img.src = basePath + image.file + "-fallback.png";
        img.alt = image.alt;
        img.width = project.nativeWidth;
        img.height = project.nativeHeight;
        img.loading = loading;
        img.decoding = "async";
        picture.appendChild(img);

        return picture;
    }

    var Lightbox = (function () {
        var root = null;
        var imageHost = null;
        var counterEl = null;
        var closeBtn = null;
        var prevBtn = null;
        var nextBtn = null;
        var project = null;
        var index = 0;
        var lastFocused = null;

        function ensureRoot() {
            if (root) return;
            root = document.createElement("div");
            root.className = "project-lightbox";
            root.setAttribute("role", "dialog");
            root.setAttribute("aria-modal", "true");
            root.setAttribute("aria-label", "Galleria immagini progetto");
            root.hidden = true;

            var inner = document.createElement("div");
            inner.className = "project-lightbox-inner";

            prevBtn = document.createElement("button");
            prevBtn.type = "button";
            prevBtn.className = "project-lightbox-nav project-lightbox-prev";
            prevBtn.setAttribute("aria-label", "Immagine precedente");
            prevBtn.innerHTML = "<span aria-hidden=\"true\">&#8592;</span>";
            prevBtn.addEventListener("click", function () { show(index - 1); });

            nextBtn = document.createElement("button");
            nextBtn.type = "button";
            nextBtn.className = "project-lightbox-nav project-lightbox-next";
            nextBtn.setAttribute("aria-label", "Immagine successiva");
            nextBtn.innerHTML = "<span aria-hidden=\"true\">&#8594;</span>";
            nextBtn.addEventListener("click", function () { show(index + 1); });

            imageHost = document.createElement("div");
            imageHost.className = "project-lightbox-image";

            closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.className = "project-lightbox-close";
            closeBtn.setAttribute("aria-label", "Chiudi galleria");
            closeBtn.innerHTML = "<span aria-hidden=\"true\">&times;</span>";
            closeBtn.addEventListener("click", close);

            counterEl = document.createElement("div");
            counterEl.className = "project-lightbox-counter";

            inner.appendChild(closeBtn);
            inner.appendChild(prevBtn);
            inner.appendChild(imageHost);
            inner.appendChild(nextBtn);
            inner.appendChild(counterEl);
            root.appendChild(inner);
            document.body.appendChild(root);

            root.addEventListener("click", function (event) {
                if (event.target === root) close();
            });
            document.addEventListener("keydown", onKeydown);
        }

        function onKeydown(event) {
            if (!root || root.hidden) return;
            if (event.key === "Escape") {
                event.preventDefault();
                close();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                show(index - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                show(index + 1);
            } else if (event.key === "Tab") {
                trapFocus(event);
            }
        }

        function trapFocus(event) {
            var focusable = [prevBtn, nextBtn, closeBtn];
            var currentIndex = focusable.indexOf(document.activeElement);
            if (event.shiftKey) {
                if (document.activeElement === focusable[0]) {
                    event.preventDefault();
                    focusable[focusable.length - 1].focus();
                }
            } else if (currentIndex === focusable.length - 1) {
                event.preventDefault();
                focusable[0].focus();
            }
        }

        function show(newIndex) {
            var count = project.images.length;
            index = (newIndex + count) % count;
            var image = project.images[index];
            imageHost.innerHTML = "";
            imageHost.appendChild(
                buildPicture(project, image, { sizes: "90vw", loading: "eager" })
            );
            counterEl.textContent = (index + 1) + " / " + count;
        }

        function open(proj, startIndex, triggerEl) {
            ensureRoot();
            project = proj;
            lastFocused = triggerEl || document.activeElement;
            show(startIndex);
            root.hidden = false;
            document.body.classList.add("is-lightbox-open");
            gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
            closeBtn.focus();
        }

        function close() {
            if (!root || root.hidden) return;
            gsap.to(root, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
                onComplete: function () {
                    root.hidden = true;
                    document.body.classList.remove("is-lightbox-open");
                    if (lastFocused && typeof lastFocused.focus === "function") {
                        lastFocused.focus();
                    }
                }
            });
        }

        return { open: open };
    })();

    function renderProjectGallery(container, projectKey) {
        var project = GALLERY_PROJECTS[projectKey];
        if (!project || !container) return false;

        container.innerHTML = "";
        container.classList.add("project-gallery-grid");

        project.images.forEach(function (image, i) {
            var thumb = document.createElement("button");
            thumb.type = "button";
            thumb.className = "project-gallery-thumb";
            thumb.setAttribute("aria-label", "Apri immagine " + (i + 1) + " di " + project.images.length + ": " + image.alt);
            thumb.appendChild(buildPicture(project, image, { loading: i < 4 ? "eager" : "lazy" }));
            thumb.addEventListener("click", function () {
                Lightbox.open(project, i, thumb);
            });
            container.appendChild(thumb);
        });

        return true;
    }

    window.ProjectGallery = { render: renderProjectGallery };
})();
