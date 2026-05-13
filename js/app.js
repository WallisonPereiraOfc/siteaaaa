"use strict";

(() => {
  const WHATSAPP_NUMBER = "558199910958";
  const DEFAULT_WHATSAPP_MESSAGE =
    "Olá! Vim pelo site Milagres que Andam e gostaria de receber orientação sobre atendimento, resgate ou internação.";

  const SELECTORS = {
    whatsappButtons: ".js-whatsapp",
    serviceButtons: ".js-service",
    leadForm: "#leadForm",
    revealItems: ".reveal",
    tiltCards:
      ".benefit, .service-card, .poster-card, .story-card, .feature, .contact-side",
    parallaxMedia: ".js-parallax-media img",
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const getValue = (selector) => $(selector)?.value?.trim() || "";

  const prefersReducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const supportsFinePointer = () =>
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? true;

  const openWhatsapp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const bindWhatsappButtons = () => {
    $$(SELECTORS.whatsappButtons).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openWhatsapp(DEFAULT_WHATSAPP_MESSAGE);
      });
    });
  };

  const bindServiceButtons = () => {
    $$(SELECTORS.serviceButtons).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();

        const service = button.dataset.service || "atendimento";
        openWhatsapp(
          `Olá! Vim pelo site Milagres que Andam e tenho interesse em: ${service}. Gostaria de saber valores, disponibilidade e próximos passos.`,
        );
      });
    });
  };

  const bindLeadForm = () => {
    const form = $(SELECTORS.leadForm);

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = getValue("#nome");
      const phone = getValue("#telefone") || "não informado";
      const interest = getValue("#interesse") || "atendimento";
      const message =
        getValue("#mensagem") || "Gostaria de receber orientação.";

      openWhatsapp(
        `Olá! Meu nome é ${name}. Tenho interesse em: ${interest}. Telefone: ${phone}. Mensagem: ${message}`,
      );
    });
  };

  const setRevealDelays = (elements) => {
    elements.forEach((element, index) => {
      const delay = (index % 6) * 70;
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  };

  const initRevealObserver = () => {
    const revealItems = $$(SELECTORS.revealItems);

    if (!revealItems.length) return;

    setRevealDelays(revealItems);

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((element) => element.classList.add("show"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.13 },
    );

    revealItems.forEach((element) => observer.observe(element));
  };

  const initTiltCards = () => {
    if (prefersReducedMotion() || !supportsFinePointer()) return;

    $$(SELECTORS.tiltCards).forEach((card) => {
      card.classList.add("premium-tilt");

      card.addEventListener(
        "pointermove",
        (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          card.style.setProperty("--tilt-y", `${x * 5}deg`);
          card.style.setProperty("--tilt-x", `${y * -5}deg`);
          card.style.setProperty("--tilt-lift", "-4px");
        },
        { passive: true },
      );

      card.addEventListener(
        "pointerleave",
        () => {
          card.style.setProperty("--tilt-y", "0deg");
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-lift", "0px");
        },
        { passive: true },
      );
    });
  };

  const initParallaxMedia = () => {
    if (prefersReducedMotion()) return;

    const mediaItems = $$(SELECTORS.parallaxMedia);
    let ticking = false;

    if (!mediaItems.length) return;

    const updateMediaPosition = () => {
      const viewportHeight = window.innerHeight || 1;

      mediaItems.forEach((image) => {
        const rect = image.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const progress =
          (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        const translateY = Math.max(-10, Math.min(10, progress * -18));

        image.style.setProperty("--media-y", `${translateY}px`);
      });

      ticking = false;
    };

    const requestTick = () => {
      if (ticking) return;

      window.requestAnimationFrame(updateMediaPosition);
      ticking = true;
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    requestTick();
  };

  const init = () => {
    bindWhatsappButtons();
    bindServiceButtons();
    bindLeadForm();
    initRevealObserver();
    initTiltCards();
    initParallaxMedia();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
    return;
  }

  init();
})();
