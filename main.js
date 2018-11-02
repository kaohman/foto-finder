var uploadPhotoButton = document.getElementById('photo-input');
var addToAlbum = document.getElementById('js-add-to-album');
var viewFavorites = document.getElementById('js-view-favorites');
var searchButton = document.getElementById('js-search');

var photosArray = [];

uploadPhotoButton.addEventListener('change', getPhoto);

function getPhoto(event) {
  var photoFile = event.target.files;
  var textInputs = document.querySelectorAll('.js-text-inputs');
  checkTextFields(textInputs);
  
  addToAlbum.addEventListener('click', function() {
    saveNewPhotoCard(titleInput, captionInput, photoFile);
  });
};

function checkTextFields(inputs) {
  inputs.forEach((input, i, inputs) => {
    if (inputs[0].value && inputs[1].value) {
      enableButton(addToAlbum);
    }
      
    input.addEventListener('input', event => {
      if (inputs[0].value && inputs[1].value) {
        enableButton(addToAlbum);
      } else {
        disableButton(addToAlbum);
      }
    });
  });
}

function disableButton(button) {
  button.disabled = true;
};

function enableButton(button) {
  button.disabled = false;
};

function saveNewPhotoCard(title, caption, photo) {
  event.preventDefault();
  console.log(photo);

  // createCard();
  disableButton(addToAlbum);
}

function createCard() {
newCard = `
  <div class="photo-card" data-id=${photo.id}>
    <p class="title">${photo.title}</p>
    <img class="photo" src="${photo.file}" alt="use uploaded photo">
    <p class="caption">${photo.caption}</p>
    <section class="card-footer">
      <img class="card-icons" src="assets/delete.svg" alt="delete icon">
      <img class="card-icons favorite-icon" src="assets/favorite.svg" alt="favorite icon">
    </section>
  </div>`;
}