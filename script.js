const modal = document.querySelector("[data-modal]");
const modalForm = document.querySelector("[data-consultation-form]");
const modalSuccess = document.querySelector("[data-form-success]");
const pageForm = document.querySelector("[data-page-form]");
const pageFormSuccess = document.querySelector("[data-page-form-success]");

let lastFocusedElement = null;

function getFocusable(container) {
  if (!container) return [];

  return [...container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )].filter((element) => !element.hidden);
}

function resetModalForm() {
  if (!modalForm || !modalSuccess) return;

  modalForm.hidden = false;
  modalSuccess.hidden = true;
}

function openModal() {
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  resetModalForm();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const [firstFocusable] = getFocusable(modal);
  window.setTimeout(() => firstFocusable?.focus(), 80);
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", openModal);
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

modalForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  modalForm.hidden = true;
  modalSuccess.hidden = false;
  modalSuccess.querySelector("button, a")?.focus();
});

pageForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  pageForm.hidden = true;
  pageFormSuccess.hidden = false;
  pageFormSuccess.setAttribute("tabindex", "-1");
  pageFormSuccess.focus();
});

document.querySelectorAll(".faq-item > button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const willOpen = !item.classList.contains("is-open");

    document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      if (openItem === item) return;
      openItem.classList.remove("is-open");
      openItem.querySelector("button")?.setAttribute("aria-expanded", "false");
    });

    item.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("keydown", (event) => {
  if (!modal?.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = getFocusable(modal);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
