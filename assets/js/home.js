document.addEventListener('DOMContentLoaded', () => {
    const lessonsContainer = document.querySelector('.menu-section .row');
  
    // Fetch lessons data from backend
    fetch('')
      .then((response) => response.json())
      .then((lessons) => {
        // Clear existing content
        lessonsContainer.innerHTML = '';
  
        // Generate cards dynamically
        lessons.forEach((lesson) => {
          const lessonCard = `
            <div class="col-md-4 text-center mb-4">
              <div class="lesson-card">
                <img src="${lesson.image_url}" alt="${lesson.title}">
                <h3>${lesson.title}</h3>
                <p>${lesson.description}</p>
              </div>
            </div>
          `;
          lessonsContainer.insertAdjacentHTML('beforeend', lessonCard);
        });
      })
      .catch((error) => {
        console.error('Error fetching lessons:', error);
      });
  });
  