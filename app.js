function initSmoothScroll() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        setTimeout(function () {
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    });
  });
}

function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  }

  window.addEventListener("scroll", handleScroll);
}

function initParallax() {
  const hero = document.getElementById("hero");
  const heroBackground = hero.querySelector(".hero-background");

  function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
      const parallaxSpeed = scrolled * 0.3;
      heroBackground.style.transform = `translateY(${parallaxSpeed}px) scale(1.1)`;
    }
  }

  window.addEventListener("scroll", handleParallax, { passive: true });
}

function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  function handleIntersection(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }

  const observer = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );

  const sections = document.querySelectorAll("section");
  const projetoCards = document.querySelectorAll(".projeto-card");

  sections.forEach(function (section) {
    observer.observe(section);
  });

  projetoCards.forEach(function (card) {
    observer.observe(card);
  });
}

function initFormValidation() {
  const form = document.getElementById("contatoForm");
  const formMessage = document.getElementById("formMessage");
  const currentLang = localStorage.getItem("language") || "en";

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = "form-message " + type + " show";

    setTimeout(function () {
      formMessage.classList.remove("show");
    }, 5000);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !mensagem) {
      const msgPt = "Por favor, preencha todos os campos.";
      const msgEn = "Please fill in all fields.";
      showMessage(currentLang === "pt" ? msgPt : msgEn, "error");
      return;
    }

    if (!validateEmail(email)) {
      const msgPt = "Por favor, insira um email válido.";
      const msgEn = "Please enter a valid email.";
      showMessage(currentLang === "pt" ? msgPt : msgEn, "error");
      return;
    }

    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          const msgPt =
            "Mensagem enviada com sucesso! Entrarei em contato em breve.";
          const msgEn = "Message sent successfully! I'll contact you soon.";
          showMessage(currentLang === "pt" ? msgPt : msgEn, "success");
          form.reset();
        } else {
          const msgPt = "Erro ao enviar mensagem. Tente novamente.";
          const msgEn = "Error sending message. Please try again.";
          showMessage(currentLang === "pt" ? msgPt : msgEn, "error");
        }
      })
      .catch(function (error) {
        const msgPt = "Erro ao enviar mensagem. Tente novamente.";
        const msgEn = "Error sending message. Please try again.";
        showMessage(currentLang === "pt" ? msgPt : msgEn, "error");
      });
  }

  form.addEventListener("submit", handleSubmit);
}

function initScrollAnimations() {
  let timeout;

  function handleScroll() {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(function () {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.pageYOffset + window.innerHeight / 2;

      sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition <= sectionTop + sectionHeight
        ) {
          section.style.opacity = "1";
        }
      });
    });
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

function initNavbarActive() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();
}

function initLanguageToggle() {
  const languageToggle = document.getElementById("languageToggle");
  const ptButton = languageToggle.querySelector('[data-lang="pt"]');
  const enButton = languageToggle.querySelector('[data-lang="en"]');

  function setLanguage(lang) {
    localStorage.setItem("language", lang);

    const elementsToUpdate = document.querySelectorAll(
      "[data-lang-pt][data-lang-en]"
    );
    elementsToUpdate.forEach(function (element) {
      const textPt = element.getAttribute("data-lang-pt");
      const textEn = element.getAttribute("data-lang-en");
      element.textContent = lang === "pt" ? textPt : textEn;
    });

    document.documentElement.setAttribute("data-lang", lang);

    ptButton.classList.toggle("active", lang === "pt");
    enButton.classList.toggle("active", lang === "en");
  }

  function loadSavedLanguage() {
    const savedLang = localStorage.getItem("language") || "en";
    setLanguage(savedLang);
  }

  ptButton.addEventListener("click", function () {
    setLanguage("pt");
  });

  enButton.addEventListener("click", function () {
    setLanguage("en");
  });

  loadSavedLanguage();
}

document.addEventListener("DOMContentLoaded", function () {
  initSmoothScroll();
  initNavbarScroll();
  initParallax();
  initIntersectionObserver();
  initFormValidation();
  initScrollAnimations();
  initNavbarActive();
  initLanguageToggle();

  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    offset: 100,
  });
});
