// Helper: Load saved photos from localStorage
function loadPhotos() {
  const stored = localStorage.getItem('aestheticPhotos');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch(e) {
    return [];
  }
}

// Helper: Save photos array to localStorage
function savePhotos(photos) {
  localStorage.setItem('aestheticPhotos', JSON.stringify(photos));
}

// Render gallery photos
function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  const photos = loadPhotos();
  if(photos.length === 0) {
    gallery.innerHTML = '<p style="color:#b3a29e; font-style: italic; text-align:center;">Your gallery is empty. Add some photos!</p>';
    return;
  }
  photos.forEach((photo, index) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label', 'Photo ' + (index + 1));
    const img = document.createElement('img');
    img.src = photo;
    img.alt = 'Gallery photo ' + (index + 1);
    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.textContent = '×';
    btn.setAttribute('aria-label', 'Delete photo ' + (index + 1));
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removePhoto(index);
    });
    card.appendChild(img);
    card.appendChild(btn);
    gallery.appendChild(card);
  });
}

// Remove photo by index
function removePhoto(idx) {
  let photos = loadPhotos();
  photos.splice(idx, 1);
  savePhotos(photos);
  renderGallery();
}

// Handle upload form submit
document.getElementById('uploadForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('photoInput');
  const files = input.files;
  if (!files.length) {
    alert('Please select at least one photo to upload.');
    return;
  }
  const photos = loadPhotos();

  // Read each file as a data URL and store
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    if(!files[i].type.startsWith('image/')) continue;
    promises.push(new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target.result);
      reader.onerror = () => reject('Error reading file');
      reader.readAsDataURL(files[i]);
    }));
  }

  Promise.all(promises).then(images => {
    const updatedPhotos = photos.concat(images);
    savePhotos(updatedPhotos);
    renderGallery();
    input.value = '';
  }).catch(() => {
    alert('Error uploading one or more photos.');
  });
});

// Initial render on page load
window.addEventListener('DOMContentLoaded', renderGallery);
