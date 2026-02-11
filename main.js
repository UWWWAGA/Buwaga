document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────
  // Элементы, которые действительно есть в HTML
  // ────────────────────────────────────────────────
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".card-section");
  const card = document.querySelector(".card");
  const notification = document.getElementById("notification");
  const timelineYears = document.querySelectorAll(".year");
  const timelineItems = document.querySelectorAll(".card-item");
  const timelineNavPrev = document.querySelector(".prev-year");
  const timelineNavNext = document.querySelector(".next-year");
  const contactCopyBtns = document.querySelectorAll(".contact-copy");
  const experienceBar = document.querySelector(".experience-progress");
  const statValues = document.querySelectorAll(".stat-value");

  // Состояние
  let currentTheme = localStorage.getItem("theme") || "light";
  let currentYear = "2023";

  // ────────────────────────────────────────────────
  // Уведомления
  // ────────────────────────────────────────────────
  function showNotification(message, type = "info") {
    if (!notification) return;

    const text = notification.querySelector(".notification-text");
    const icon = notification.querySelector(".notification-icon");

    text.textContent = message;

    icon.className = "notification-icon fas";
    if (type === "success") icon.classList.add("fa-check-circle");
    else if (type === "error") icon.classList.add("fa-exclamation-circle");
    else if (type === "warning") icon.classList.add("fa-exclamation-triangle");
    else icon.classList.add("fa-info-circle");

    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3200);
  }

  // ────────────────────────────────────────────────
  // Тема (пока без кнопки — но логика готова)
  // ────────────────────────────────────────────────
  function initTheme() {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }

  // Если позже добавишь кнопку, просто вызывай эту функцию
  // function toggleTheme() { ... }

  // ────────────────────────────────────────────────
  // Переключение секций (Обо мне / Опыт / Контакты)
  // ────────────────────────────────────────────────
  function switchSection(sectionId) {
    if (!card) return;

    card.setAttribute("data-loading", "true");
    card.parentElement.classList.add("switching"); // или card.classList.add("switching")

    sections.forEach((s) => s.classList.remove("is-active"));
    navButtons.forEach((b) => {
      b.classList.remove("is-active");
      b.removeAttribute("aria-current");
    });

    const targetSection = document.querySelector(sectionId);
    const targetButton = document.querySelector(
      `.nav-btn[data-section="${sectionId}"]`,
    );

    if (targetSection && targetButton) {
      setTimeout(() => {
        targetSection.classList.add("is-active");
        targetButton.classList.add("is-active");
        targetButton.setAttribute("aria-current", "page");

        card.setAttribute("data-state", sectionId);
        card.setAttribute("data-loading", "false");

        // убираем временный класс после завершения анимации
        card.parentElement.classList.remove("switching");

        card.scrollTo({ top: 0, behavior: "smooth" });
      }, 200); // подстрой под длительность transition
    }
  }

  // ────────────────────────────────────────────────
  // Частицы на фоне (реакция на мышь)
  // ────────────────────────────────────────────────
  function initParticles() {
    const particles = document.querySelectorAll(".particle");
    if (!particles.length) return;

    document.addEventListener("mousemove", (e) => {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;

      particles.forEach((p, i) => {
        const speed = 0.018 * (i + 1);
        const x = mx * 40 * speed;
        const y = my * 40 * speed;
        p.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // ────────────────────────────────────────────────
  // Таймлайн (переключение годов 2023–2025)
  // ────────────────────────────────────────────────
  function initTimeline() {
    if (!timelineYears.length) return;

    function setActiveYear(year) {
      currentYear = year;
      timelineYears.forEach((y) =>
        y.classList.toggle("active", y.dataset.year === year),
      );
      timelineItems.forEach((item) =>
        item.classList.toggle("active", item.dataset.year === year),
      );
    }

    timelineYears.forEach((year) => {
      year.addEventListener("click", () => setActiveYear(year.dataset.year));
    });

    // переключение по клику на саму карточку таймлайна
    timelineItems.forEach((item) => {
      item.addEventListener("click", () => {
        const year = item.dataset.year;
        if (year) setActiveYear(year);
      });
    });

    timelineNavPrev?.addEventListener("click", () => {
      const years = Array.from(timelineYears).map((y) => y.dataset.year);
      let idx = years.indexOf(currentYear);
      idx = idx > 0 ? idx - 1 : years.length - 1;
      setActiveYear(years[idx]);
    });

    timelineNavNext?.addEventListener("click", () => {
      const years = Array.from(timelineYears).map((y) => y.dataset.year);
      let idx = years.indexOf(currentYear);
      idx = idx < years.length - 1 ? idx + 1 : 0;
      setActiveYear(years[idx]);
    });

    // начальное состояние
    setActiveYear(currentYear);
  }

  // ────────────────────────────────────────────────
  // Навыки — интерактивность тегов
  // ────────────────────────────────────────────────
  function initSkills() {
    // клик по любому тегу навыка → уведомление
    document.querySelectorAll(".skill-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        const name = tag.textContent.trim();
        const level = tag.dataset.skill || "—";
        showNotification(`${name} — ${level}%`, "info");
      });
    });
  }

  // ────────────────────────────────────────────────
  // Копирование @buwaga и других контактов
  // ────────────────────────────────────────────────
  function initCopy() {
    contactCopyBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.text;
        if (!text) return;

        navigator.clipboard
          .writeText(text)
          .then(() => showNotification("Скопировано!", "success"))
          .catch(() => showNotification("Не удалось скопировать", "error"));
      });
    });
  }

  // ────────────────────────────────────────────────
  // Анимации цифр и прогресс-баров
  // ────────────────────────────────────────────────
  function animateOnLoad() {
    // полоса опыта в шапке
    if (experienceBar) {
      setTimeout(() => {
        const level = experienceBar.dataset.level || 85;
        experienceBar.style.width = level + "%";
      }, 400);
    }

    // счётчики (проекты / часы / клиенты)
    statValues.forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      if (!target) return;

      let current = 0;
      const duration = 1400;
      const step = target / (duration / 16);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        const originalText = el.textContent;
        const hasPlus = originalText.includes("+");

        el.textContent = Math.floor(current) + (hasPlus ? "+" : "");
      }, 16);
    });
  }

  // ────────────────────────────────────────────────
  // Запуск
  // ────────────────────────────────────────────────
  function init() {
    initTheme();
    initParticles();
    initTimeline();
    initSkills();
    initCopy();
    animateOnLoad();

    // навигация по вкладкам
    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const sectionId = btn.dataset.section;
        if (sectionId) switchSection(sectionId);
      });
    });

    // приветствие
    setTimeout(() => {
      showNotification("Добро пожаловать! 👋", "success");
    }, 800);
  }

  init();
});
