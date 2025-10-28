'use strict';

// Utility function to toggle active class
const toggleActiveClass = (elem) => elem.classList.toggle('active');

// Sidebar variables
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => toggleActiveClass(sidebar));
} else {
  console.error('Sidebar or Sidebar Button not found');
}

// Testimonials variables
const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');
const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

// Function to toggle modal visibility
const toggleModal = () => {
  console.log('Toggling modal visibility');
  toggleActiveClass(modalContainer);
  toggleActiveClass(overlay);
};

// Set up click events for testimonials items
testimonialsItems.forEach(item => {
  item.addEventListener('click', () => {
    const avatar = item.querySelector('[data-testimonials-avatar]');
    const title = item.querySelector('[data-testimonials-title]');
    const text = item.querySelector('[data-testimonials-text]');

    if (avatar && title && text) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
      modalTitle.innerHTML = title.innerHTML;
      modalText.innerHTML = text.innerHTML;
      toggleModal();
    } else {
      console.error('Modal content not found in:', item);
    }
  });
});

// Set up click events for modal close button and overlay
if (modalCloseBtn && overlay) {
  modalCloseBtn.addEventListener('click', toggleModal);
  overlay.addEventListener('click', toggleModal);
} else {
  console.error('Modal close button or overlay not found');
}

// Custom select variables
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtns = document.querySelectorAll('[data-filter-btn]');

if (select) {
  select.addEventListener('click', () => toggleActiveClass(select));
} else {
  console.error('Select element not found');
}

// Handle select item clicks
selectItems.forEach(item => {
  item.addEventListener('click', () => {
    const selectedValue = item.innerText.toLowerCase();
    selectValue.innerText = item.innerText;
    toggleActiveClass(select);
    filterProjects(selectedValue);
  });
});

// Filter projects based on selected value
const filterItems = document.querySelectorAll('[data-filter-item]');
const filterProjects = (selectedValue) => {
  filterItems.forEach(item => {
    if (selectedValue === 'all' || selectedValue === item.dataset.category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};

// Handle filter button clicks for larger screens
let lastClickedBtn = filterBtns[0];
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedValue = btn.innerText.toLowerCase();
    selectValue.innerText = btn.innerText;
    filterProjects(selectedValue);

    if (lastClickedBtn) {
      lastClickedBtn.classList.remove('active');
    }
    btn.classList.add('active');
    lastClickedBtn = btn;
  });
});

// Contact form variables
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

if (form && formBtn) {
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      formBtn.disabled = !form.checkValidity();
    });
  });
} else {
  console.error('Form or Form Button not found');
}

// Page navigation variables
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach((link, index) => {
  link.addEventListener('click', () => {
    pages.forEach((page, i) => {
      if (link.innerHTML.toLowerCase() === page.dataset.page) {
        page.classList.add('active');
        navigationLinks[i].classList.add('active');
        window.scrollTo(0, 0);
      } else {
        page.classList.remove('active');
        navigationLinks[i].classList.remove('active');
      }
    });
  });
});
