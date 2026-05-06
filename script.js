(function () {
  "use strict";

  var WA_NUMBER = "5522998592587";
  var THEME_KEY = "jb-theme";

  function buildWaUrl(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function openWhatsApp(text) {
    window.open(buildWaUrl(text), "_blank", "noopener,noreferrer");
  }

  var PRESETS = {
    header:
      "Olá, Dra. Josiane Barcelos! Vim pelo site e gostaria de agendar uma avaliação.\n\n" +
      "Fonte do lead: Cabeçalho do site",
    hero:
      "Olá, Dra. Josiane Barcelos! Vim pelo site e gostaria de agendar uma avaliação.\n\n" +
      "Fonte do lead: Hero do site",
    cta:
      "Olá, Dra. Josiane Barcelos! Vim pelo site e gostaria de saber mais sobre os tratamentos.\n\n" +
      "Fonte do lead: Chamada emocional do site",
    location:
      "Olá, Dra. Josiane Barcelos! Vim pelo site e gostaria de agendar uma avaliação.\n\n" +
      "Fonte do lead: Localização do site",
    footer:
      "Olá, Dra. Josiane Barcelos! Vim pelo site e gostaria de agendar uma avaliação.\n\n" +
      "Fonte do lead: Rodapé do site",
  };

  /* Theme */
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    if (theme !== "light" && theme !== "dark") theme = "light";
    document.documentElement.setAttribute("data-theme", theme);
    setStoredTheme(theme);
  }

  function initTheme() {
    var stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
      return;
    }
    /* Primeira visita: sempre tema claro (ignora preferência do sistema) */
    applyTheme("light");
  }

  document.getElementById("themeToggle")?.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  initTheme();

  /* Nav */
  var nav = document.querySelector(".nav");
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var navBackdrop = document.getElementById("navBackdrop");

  function navIsMobile() {
    return typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("nav-open", !!(open && navIsMobile()));
    navBackdrop?.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function closeNav() {
    setNavOpen(false);
  }

  navToggle?.addEventListener("click", function () {
    setNavOpen(!nav.classList.contains("is-open"));
  });

  navBackdrop?.addEventListener("click", closeNav);

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeNav();
  });

  navMenu?.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* Preset WhatsApp buttons */
  function bindPreset(id, presetKey) {
    var el = document.getElementById(id);
    if (!el || !PRESETS[presetKey]) return;
    el.addEventListener("click", function (e) {
      closeNav();
      e.preventDefault();
      openWhatsApp(PRESETS[presetKey]);
    });
  }

  bindPreset("headerWhatsApp", "header");
  bindPreset("heroWhatsApp", "hero");
  bindPreset("ctaWhatsApp", "cta");
  bindPreset("locWhatsApp", "location");
  bindPreset("footerWhatsApp", "footer");

  /* Contact form */
  var form = document.getElementById("formContato");
  var formError = document.getElementById("formError");

  function showFormError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.hidden = false;
  }

  function hideFormError() {
    if (!formError) return;
    formError.hidden = true;
    formError.textContent = "";
  }

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    hideFormError();

    var nome = document.getElementById("nome")?.value.trim() || "";
    var telefone = document.getElementById("telefone")?.value.trim() || "";
    var tratamento = document.getElementById("tratamento")?.value.trim() || "";
    var mensagem = document.getElementById("mensagem")?.value.trim() || "";

    if (!nome) {
      showFormError("Por favor, preencha seu nome para continuarmos.");
      document.getElementById("nome")?.focus();
      return;
    }
    if (!telefone) {
      showFormError("Por favor, informe um telefone para contato.");
      document.getElementById("telefone")?.focus();
      return;
    }
    if (!tratamento) {
      showFormError("Selecione o tratamento de interesse na lista.");
      document.getElementById("tratamento")?.focus();
      return;
    }

    var body =
      "Olá, Dra. Josiane Barcelos! Vim pelo site e gostaria de agendar uma avaliação.\n\n" +
      "Fonte do lead: Site institucional\n\n" +
      "Nome: " +
      nome +
      "\n" +
      "Telefone: " +
      telefone +
      "\n" +
      "Tratamento de interesse: " +
      tratamento +
      "\n" +
      "Mensagem: " +
      (mensagem || "(não informada)");

    openWhatsApp(body);
  });

  /* Floating WhatsApp + modal (botão no padrão do site Dra. Carla Santana) */
  var waFloatTrigger = document.getElementById("wa-float-trigger");
  var modal = document.getElementById("waModal");
  var modalBackdrop = document.getElementById("waModalBackdrop");
  var modalClose = document.getElementById("waModalClose");
  var modalInput = document.getElementById("waModalInput");
  var modalSend = document.getElementById("waModalSend");
  var lastFocus = null;

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("wa-modal-open");
    waFloatTrigger?.setAttribute("aria-expanded", "true");
    modalInput?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("wa-modal-open");
    waFloatTrigger?.setAttribute("aria-expanded", "false");
    if (modalInput) modalInput.value = "";
    lastFocus?.focus?.();
  }

  waFloatTrigger?.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });

  modalBackdrop?.addEventListener("click", closeModal);
  modalClose?.addEventListener("click", closeModal);

  modalSend?.addEventListener("click", function () {
    var text = modalInput?.value.trim() || "";
    var msg;
    if (text) {
      msg =
        "Olá, Dra. Josiane Barcelos! Vim pelo site.\n\n" +
        "Fonte do lead: Botão flutuante do site\n\n" +
        "Mensagem: " +
        text;
    } else {
      msg =
        "Olá, Dra. Josiane Barcelos! Vim pelo site e gostaria de agendar uma avaliação.\n\n" +
        "Fonte do lead: Botão flutuante do site";
    }
    closeModal();
    openWhatsApp(msg);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Header shadow on scroll */
  var header = document.querySelector(".header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add("header--scrolled");
    else header.classList.remove("header--scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
