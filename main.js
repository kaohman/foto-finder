// URL.revokeObjectURL()

var uploadPhotoButton = document.getElementById('photo-input');
var addToAlbumButton = document.getElementById('js-add-to-album');
var viewFavorites = document.getElementById('js-view-favorites');
var searchButton = document.getElementById('js-search');
var photosArray = [];

// addToAlbum.addEventListener('submit', stopRefresh);

// function stopRefresh(event) {
//   event.preventDefault();
// }

uploadPhotoButton.addEventListener('change', getPhoto);

function getPhoto(event) {
  var photoURL = convertPhotoFile(event.target.files[0]);
  console.log(photoURL);
  var textInputs = document.querySelectorAll('.text-inputs');
  checkTextFields(textInputs);

  addToAlbumButton.addEventListener('click', function() {
    saveNewPhotoCard(textInputs[0].value, textInputs[1].value, photoURL);
  });
};

function checkTextFields(inputs) {
  inputs.forEach((input, i, inputs) => {
    if (inputs[0].value && inputs[1].value) {
      enableButton(addToAlbumButton);
    }
      
    input.addEventListener('input', event => {
      if (inputs[0].value && inputs[1].value) {
        enableButton(addToAlbumButton);
      } else {
        disableButton(addToAlbumButton);
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

function convertPhotoFile(photo) {
  return window.URL.createObjectURL(photo);
}

function saveNewPhotoCard(title, caption, photoUrl) {
  event.preventDefault();

  var photoObj = new Photo(title, caption, photoUrl);
  createCard(photoObj);
  photosArray.push(photoObj);
  photoObj.saveToStorage(photosArray);
  disableButton(addToAlbumButton);
}

function createCard(photo) {
var cardHTML = `
  <div class="photo-card" data-id=${photo.id}>
    <p class="title">${photo.title}</p>
    <img class="photo" src="${photo.file}" alt="use uploaded photo">
    <p class="caption">${photo.caption}</p>
    <section class="card-footer">
      <img class="card-icons" src="assets/delete.svg" alt="delete icon">
      <img class="card-icons favorite-icon" src="assets/favorite.svg" alt="favorite icon">
    </section>
  </div>`;
  var cardSection = document.querySelector('.card-section');
  cardSection.insertAdjacentHTML('afterbegin', cardHTML);
}


