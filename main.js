
newCard = `
  <div class="photo-card" data-id=${photo.id}>
    <p class="title">${photo.title}</p>
    <img class="photo" src="${photo.file}" alt="photo">
    <p class="caption">${photo.caption}</p>
    <section class="card-footer">
      <img class="card-icons" src="assets/delete.svg" alt="delete icon">
      <img class="card-icons favorite-icon" src="assets/favorite.svg" alt="favorite icon">
    </section>
  </div>`;