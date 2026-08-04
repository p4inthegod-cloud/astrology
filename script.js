const consultationModal = document.querySelector("[data-modal]");
const processModal = document.querySelector("[data-process-modal]");
const consultationForm = document.querySelector("[data-consultation-form]");
const formSuccess = document.querySelector("[data-form-success]");
const toast = document.querySelector("[data-toast]");

let lastFocusedElement = null;
let toastTimer = null;

function getFocusable(container) {
  return [...container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )];
}

function openDialog(dialog) {
  lastFocusedElement = document.activeElement;
  dialog.classList.add("is-open");
  dialog.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const [firstFocusable] = getFocusable(dialog);
  window.setTimeout(() => firstFocusable?.focus(), 80);
}

function closeDialog(dialog) {
  dialog.classList.remove("is-open");
  dialog.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.is-open, .process-modal.is-open")) {
    document.body.style.overflow = "";
  }

  lastFocusedElement?.focus();
}

function showToast() {
  window.clearTimeout(toastTimer);
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    consultationForm.hidden = false;
    formSuccess.hidden = true;
    openDialog(consultationModal);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(consultationModal));
});

document.querySelectorAll("[data-open-process]").forEach((button) => {
  button.addEventListener("click", () => openDialog(processModal));
});

document.querySelectorAll("[data-close-process]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(processModal));
});

document.querySelector("[data-process-to-form]").addEventListener("click", () => {
  closeDialog(processModal);
  window.setTimeout(() => openDialog(consultationModal), 120);
});

document.querySelector("[data-manager]").addEventListener("click", showToast);

consultationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  consultationForm.hidden = true;
  formSuccess.hidden = false;
  formSuccess.querySelector("button")?.focus();
});

document.addEventListener("keydown", (event) => {
  const openDialogElement = document.querySelector(".modal.is-open, .process-modal.is-open");

  if (!openDialogElement) return;

  if (event.key === "Escape") {
    closeDialog(openDialogElement);
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = getFocusable(openDialogElement);
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
