// URL.revokeObjectURL()

var addToAlbumButton = document.getElementById('js-add-to-album');
var textInputs = document.querySelectorAll('.text-inputs');
// var viewFavorites = document.getElementById('js-view-favorites');
// var searchButton = document.getElementById('js-search');
var chooseFileButton = document.getElementById('photo-input');
var photosArray = [];
var cardSection = document.querySelector('.card-section');
var favoriteCounter = 0;

// FIND A WAY TO KEEP THIS LOCAL!!!
var photoURL; 

window.addEventListener('load', createCardsOnReload);
chooseFileButton.addEventListener('change', getPhoto);
addToAlbumButton.addEventListener('click', function() {
  saveNewPhotoCard(textInputs[0].value, textInputs[1].value, photoURL);
});

cardSection.addEventListener('click', event => {
  if (event.target.classList.contains('delete-button')) {
    deleteCard(event);
  } else if (event.target.classList.contains('favorite-button')) {
    favoriteCard(event);
  }
});

function checkForFavorite(photoObj, cardTarget) {
  if (photoObj.favorite === true) {
    favoriteCounter++
    cardTarget.classList.add('favorite-button-active');
  } else {
    if (favoriteCounter > 0) { favoriteCounter-- };
    cardTarget.classList.remove('favorite-button-active');
  }
  document.getElementById('js-favorite-counter').innerText = favoriteCounter;
}

function addCardPlaceholder() {
  document.querySelector('.card-placeholder').classList.remove('hide-placeholder');
}

function checkTextFields() {
  if (textInputs[0].value && textInputs[1].value) {
    enableButton(addToAlbumButton);
  } else {
    disableButton(addToAlbumButton);
  }
}

function clearPhotoInput() {
  chooseFileButton.value = '';
  var clone = chooseFileButton.cloneNode(true);
  chooseFileButton.parentElement.appendChild(clone);
}

function clearTextInputs() {
  textInputs.forEach(function(photo) {
    photo.value = '';
  });
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
        <button class="icon-buttons delete-button"></button>
        <button class="icon-buttons favorite-button"></button>
      </section>
    </div>`;
  var cardSection = document.querySelector('.card-section');
  cardSection.insertAdjacentHTML('afterbegin', cardHTML);
}

function createCardsOnReload() {
  if(localStorage.hasOwnProperty('array')) {
    var parsedCard = JSON.parse(localStorage.getItem('array'));
    parsedCard.forEach(function(object) {
      var photoObj = new Photo(object.title, object.caption, object.file, object.favorite, object.id);
      photosArray.push(photoObj);
      createCard(photoObj);
      var cardTarget = findFavoriteTarget(photoObj.id);
      checkForFavorite(photoObj, cardTarget);
    });
    removeCardPlaceholder();
  } else {
    addCardPlaceholder();
  }
}

function deleteCard() {
  var objectId = event.target.parentElement.parentElement.dataset.id;
  var index = findIndexNumber(objectId);
  photosArray[index].deleteFromStorage(index);
  photosArray.splice(index, 1);
  event.target.closest('.photo-card').remove();
  if (photosArray.length === 0) {
    addCardPlaceholder();
  }
}

function findIndexNumber(objId) {
  for (var i = 0; i < photosArray.length; i++) {
    if (photosArray[i].id === parseInt(objId)) {
      return i
    }
  }
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

function favoriteCard() {
  var cardTarget = event.target;
  var objectId = cardTarget.parentElement.parentElement.dataset.id;
  var index = findIndexNumber(objectId);
  photosArray[index].updateFavorite();
  photosArray[index].saveToStorage(photosArray);
  checkForFavorite(photosArray[index], cardTarget);
}

function findFavoriteTarget(id) {
  var cards = cardSection.children;
  for (var i = 0; i < cards.length; i++) {
    if(parseInt(cards[i].dataset.id) === id) {
      return cards[i].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling;
    }
  }
}

function getPhoto(event) {
  photoURL = convertPhotoFile(event.target.files[0]);
  testTextFields();
}

function removeCardPlaceholder() {
  document.querySelector('.card-placeholder').classList.add('hide-placeholder');
}

function removeListeners() {
  textInputs[0].removeEventListener('input', checkTextFields);
  textInputs[1].removeEventListener('input', checkTextFields);
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

function testTextFields() {
  checkTextFields();
  textInputs[0].addEventListener('input', checkTextFields);
  textInputs[1].addEventListener('input', checkTextFields);
}



