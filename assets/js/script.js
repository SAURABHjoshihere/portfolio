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
// Note: attribute in HTML may not exist; guard all usages
const selectValue = document.querySelector('[data-select-value], [data-selecct-value]');
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
    if (selectValue) selectValue.innerText = item.innerText;
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
    if (selectValue) selectValue.innerText = btn.innerText;
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
      const matches = link.innerHTML.toLowerCase() === page.dataset.page;
      if (matches) {
        page.classList.add('active');
        if (navigationLinks[i]) navigationLinks[i].classList.add('active');
        window.scrollTo(0, 0);
      } else {
        page.classList.remove('active');
        if (navigationLinks[i]) navigationLinks[i].classList.remove('active');
      }
    });
  });
});

// ==========================
// Portfolio inline video modal
// ==========================
const projectLinks = document.querySelectorAll('.project-item > a');
const videoModalContainer = document.querySelector('[data-video-modal-container]');
const videoOverlay = document.querySelector('[data-video-overlay]');
const videoModalCloseBtn = document.querySelector('[data-video-modal-close-btn]');
const videoIframe = document.querySelector('[data-video-iframe]');
const videoElement = document.querySelector('[data-video-element]');
const videoWrapper = document.querySelector('[data-video-wrapper]');

// Extract Google Drive file ID
const extractGoogleDriveId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('drive.google.com')) {
      if (u.pathname.includes('/file/d/')) {
        const match = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) return match[1];
      } else if (u.searchParams.has('id')) {
        return u.searchParams.get('id');
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
};

// Convert Google Drive links to embed URLs
const toVideoEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    
    // YouTube handling FIRST (most common case)
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let videoId;
      
      // youtu.be/v=ID
      if (u.hostname === 'youtu.be') {
        videoId = u.pathname.slice(1);
      }
      // youtube.com/watch?v=ID
      else if (u.pathname === '/watch' && u.searchParams.has('v')) {
        videoId = u.searchParams.get('v');
      }
      // youtube.com/embed/ID (already good)
      else if (u.pathname.startsWith('/embed/')) {
        return { type: 'youtube', url: url + (url.includes('?') ? '&' : '?') + 'autoplay=1' };
      }
      
      if (videoId) {
        return { 
          type: 'youtube', 
          url: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
        };
      }
    }
    
    // Google Drive handling (unchanged)
    const fileId = extractGoogleDriveId(url);
    if (fileId) {
      return {
        type: 'googledrive',
        iframeUrl: `https://drive.google.com/file/d/${fileId}/preview?usp=sharing`,
        directUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
      };
    }
    
    // Other URLs (Vimeo, direct video, etc.)
    return { type: 'other', url: url };
    
  } catch (e) {
    console.error('Invalid URL:', url);
    return { type: 'other', url: url };
  }
};

// Function to adjust video frame based on actual dimensions
const adjustVideoFrame = (width, height) => {
  if (!videoWrapper || !width || !height || width <= 0 || height <= 0) {
    console.warn('Invalid video dimensions:', width, height);
    return;
  }
  
  // Calculate aspect ratio from actual dimensions
  const aspectRatio = width / height;
  
  // Set aspect ratio on wrapper
  videoWrapper.style.aspectRatio = `${width} / ${height}`;
  
  // Calculate max dimensions to fit viewport (leave some margin)
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxWidth = Math.min(viewportWidth * 0.92, width);
  const maxHeight = Math.min(viewportHeight * 0.85, height);
  
  // Calculate final dimensions maintaining aspect ratio
  let finalWidth = maxWidth;
  let finalHeight = maxWidth / aspectRatio;
  
  // If height exceeds max, scale down
  if (finalHeight > maxHeight) {
    finalHeight = maxHeight;
    finalWidth = maxHeight * aspectRatio;
  }
  
  // Apply styles
  videoWrapper.style.maxWidth = `${finalWidth}px`;
  videoWrapper.style.width = '100%';
  videoWrapper.style.minHeight = 'auto';
  videoWrapper.style.margin = '0 auto';
  
  console.log(`Adjusted frame: ${Math.round(finalWidth)}x${Math.round(finalHeight)}px (video: ${width}x${height}, aspect: ${aspectRatio.toFixed(2)})`);
};

const openVideoModal = (embedUrl, aspect, isShortsReels = false) => {
  if (!videoModalContainer || !videoOverlay) return;
  
  // Set initial aspect ratio from data attribute or default
  const initialAspect = aspect || '16/9';
  if (videoWrapper) {
    videoWrapper.style.maxWidth = 'none';
    videoWrapper.style.width = '100%';
    videoWrapper.style.aspectRatio = initialAspect;
    videoWrapper.style.minHeight = initialAspect === '9/16' ? '360px' : '220px';
  }
  
  // For Shorts & Reels, always use the specified aspect ratio (9/16)
  // Don't override with detected dimensions
  const shouldUseDetectedDimensions = !isShortsReels;
  
  // Handle Google Drive videos differently
  if (embedUrl && typeof embedUrl === 'object' && embedUrl.type === 'googledrive') {
    // Use video element for Google Drive (more reliable)
    if (videoElement && videoIframe) {
      videoIframe.style.display = 'none';
      videoElement.style.display = 'block';
      videoElement.src = embedUrl.directUrl;
      
      // Ensure video maintains aspect ratio without compression
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'contain';
      
      // Detect video dimensions when loaded
      const handleVideoLoad = () => {
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        if (width > 0 && height > 0 && shouldUseDetectedDimensions) {
          // Only adjust if not Shorts/Reels
          adjustVideoFrame(width, height);
        } else {
          // For Shorts/Reels, keep the specified aspect ratio
          if (isShortsReels) {
            console.log('Shorts/Reels video - using specified aspect ratio:', initialAspect);
            if (videoWrapper) {
              videoWrapper.style.aspectRatio = initialAspect;
            }
          } else {
            console.log('Video dimensions not available, using specified aspect ratio:', initialAspect);
          }
        }
      };
      
      videoElement.addEventListener('loadedmetadata', handleVideoLoad, { once: true });
      videoElement.addEventListener('loadeddata', handleVideoLoad, { once: true });
      
      console.log('Opening Google Drive video:', embedUrl.directUrl, 'Aspect:', initialAspect);
    }
  } else {
    // Use iframe for other video sources (YouTube, Google Drive preview, etc.)
    const url = typeof embedUrl === 'object' ? embedUrl.url : embedUrl;
    if (videoIframe && videoElement) {
      videoElement.style.display = 'none';
      videoIframe.style.display = 'block';
      videoIframe.src = url;
      
      // For Shorts & Reels, don't try to detect dimensions - use specified aspect ratio
      if (isShortsReels) {
        console.log('Shorts/Reels iframe - using specified aspect ratio:', initialAspect);
        if (videoWrapper) {
          videoWrapper.style.aspectRatio = initialAspect;
        }
      } else {
        // For other videos, try to detect dimensions
        const checkIframeDimensions = () => {
          try {
            const iframeDoc = videoIframe.contentDocument || videoIframe.contentWindow.document;
            const video = iframeDoc.querySelector('video');
            if (video && video.videoWidth > 0 && video.videoHeight > 0) {
              adjustVideoFrame(video.videoWidth, video.videoHeight);
              return;
            }
          } catch (e) {
            // CORS restriction - expected for most video embeds
          }
          // Fallback: use specified aspect ratio
          console.log('Using specified aspect ratio for iframe:', initialAspect);
        };
        
        videoIframe.addEventListener('load', () => {
          // Try immediately and after a short delay
          setTimeout(checkIframeDimensions, 100);
          setTimeout(checkIframeDimensions, 1000);
        }, { once: true });
      }
      
      console.log('Opening video in iframe:', url, 'Aspect:', initialAspect);
    }
  }
  
  videoModalContainer.classList.add('active');
  videoOverlay.classList.add('active');
};

const closeVideoModal = () => {
  if (!videoModalContainer || !videoOverlay) return;
  videoModalContainer.classList.remove('active');
  videoOverlay.classList.remove('active');
  // clear src to stop playback
  if (videoIframe) videoIframe.src = '';
  if (videoElement) {
    videoElement.pause();
    videoElement.src = '';
  }
};

projectLinks.forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    const embedUrl = toVideoEmbedUrl(href);
    
    // Check if this is in Shorts & Reels section
    const isShortsReels = a.closest('.shorts-reels') !== null;
    
    // Use data-aspect attribute if present, otherwise default to 16/9
    // For Shorts & Reels, default to 9/16 if not specified
    // Support both "9/16" and "9:16" formats
    let aspect = a.getAttribute('data-aspect');
    if (aspect) {
      // Normalize colon to slash for aspect ratio
      aspect = aspect.replace(':', '/');
    } else {
      aspect = isShortsReels ? '9/16' : '16/9';
    }
    
    // Store aspect ratio in the link for later use
    a.dataset.forcedAspect = aspect;
    a.dataset.isShortsReels = isShortsReels ? 'true' : 'false';
    
    openVideoModal(embedUrl, aspect, isShortsReels);
  });
});

if (videoModalCloseBtn) videoModalCloseBtn.addEventListener('click', closeVideoModal);
if (videoOverlay) videoOverlay.addEventListener('click', closeVideoModal);
