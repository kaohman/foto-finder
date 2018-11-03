// URL.revokeObjectURL()

var addToAlbumButton = document.getElementById('js-add-to-album');
var textInputs = document.querySelectorAll('.text-inputs');
// var viewFavorites = document.getElementById('js-view-favorites');
// var searchButton = document.getElementById('js-search');
var chooseFileButton = document.getElementById('photo-input');
var photosArray = [];
var photoURL;

chooseFileButton.addEventListener('change', getPhoto);
addToAlbumButton.addEventListener('click', function() {
  saveNewPhotoCard(textInputs[0].value, textInputs[1].value, photoURL);
});

function testTextFields() {
  checkTextFields();
  textInputs[0].addEventListener('input', checkTextFields);
  textInputs[1].addEventListener('input', checkTextFields);
}

function checkTextFields() {
  if (textInputs[0].value && textInputs[1].value) {
    enableButton(addToAlbumButton);
  } else {
    disableButton(addToAlbumButton);
  }
}

function convertPhotoFile(photo) {
  return window.URL.createObjectURL(photo);
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

function createCardsOnReload() {

}

function deleteCard() {

}

function disableButton(button) {
  button.disabled = true;
}

function editText() {
  event.target.contentEditable = true;
}

function enableButton(button) {
  button.disabled = false;
}

function getPhoto(event) {
  photoURL = convertPhotoFile(event.target.files[0]);
  testTextFields();
}

function removeCardPlaceholder() {
  document.querySelector('.card-placeholder').classList.add('hide-placeholder');
}

function addCardPlaceholder() {
  document.querySelector('.card-placeholder').classList.remove('hide-placeholder');
}

function saveNewPhotoCard(title, caption, photoUrl) {
  event.preventDefault();
  var photoObj = new Photo(title, caption, photoUrl);
  createCard(photoObj);
  photosArray.push(photoObj);
  photoObj.saveToStorage(photosArray);
  disableButton(addToAlbumButton);
  removeCardPlaceholder();
  clearTextInputs();
  removeListeners();
}

function clearTextInputs() {
  textInputs.forEach(function(photo) {
    photo.value = '';
  });
}

function removeListeners() {
  textInputs[0].removeEventListener('input', checkTextFields);
  textInputs[1].removeEventListener('input', checkTextFields);
}

function clearPhotoInput() {
  chooseFileButton.value = '';
  var clone = chooseFileButton.cloneNode(true);
  chooseFileButton.parentElement.appendChild(clone);
}


