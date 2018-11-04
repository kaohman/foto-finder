// When ‘Filtering and Searching by Text’ and ‘Viewing Phtos’, photos that do not need to be shown on the dom should be completely removed from the dom, instead of only being hidden from view
// URL.revokeObjectURL()

var addToAlbumButton = document.getElementById('js-add-to-album');
var textInputs = document.querySelectorAll('.text-inputs');
var viewFavorites = document.getElementById('js-view-favorites');
var chooseFileButton = document.getElementById('photo-input');
var photosArray = [];
var cardSection = document.querySelector('.card-section');

viewFavorites.addEventListener('click', showFavorites);
cardSection.addEventListener('click', event => {
  if (event.target.classList.contains('delete-button')) {
    deleteCard(event);
  } else if (event.target.classList.contains('favorite-button')) {
    favoriteCard(event);
  }
});

function showFavorites() {
  var allCards = Array.from(document.querySelectorAll('.photo-card'));

  debugger
  allCards.forEach(card => {
    cardTarget = card.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling;
    if (cardTarget.classList.contains('favorite-button-active')) {
      cardTarget.classList.remove('hidden');
    } else {
      cardTarget.classList.add('hidden');
    }
  });
}

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
function favoriteCard() {
  var cardTarget = event.target;
  var objectId = cardTarget.parentElement.parentElement.dataset.id;
  var index = findIndexNumber(objectId);
  photosArray[index].updateFavorite();
  photosArray[index].saveToStorage(photosArray);
  checkForFavorite(photosArray[index], cardTarget);
}


// FIND A WAY TO KEEP THESE LOCAL!!!
var photoURL; 
var favoriteCounter = 0;

window.addEventListener('load', createCardsOnReload);
chooseFileButton.addEventListener('change', getPhoto);
cardSection.addEventListener('dblclick', updateCard);
addToAlbumButton.addEventListener('click', function() {
  saveNewPhotoCard(textInputs[0].value, textInputs[1].value, photoURL);
});

// Fix interaction with search input and show more button
document.getElementById('js-search').addEventListener('keyup', liveSearch);
document.querySelector('.show-button').addEventListener('click', showCards);



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
      <p class="js-text title">${photo.title}</p>
      <img class="photo" src="${photo.file}" alt="use uploaded photo">
      <p class="js-text caption">${photo.caption}</p>
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
    showRecentCards();
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
  showRecentCards();
  if (photosArray.length === 0) {
    addCardPlaceholder();
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



function findFavoriteTarget(id) {
  var cards = cardSection.children;
  for (var i = 0; i < cards.length; i++) {
    if(parseInt(cards[i].dataset.id) === id) {
      return cards[i].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling;
    }
  }
}

function findIndexNumber(objId) {
  for (var i = 0; i < photosArray.length; i++) {
    if (photosArray[i].id === parseInt(objId)) {
      return i
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
  showRecentCards();
}

function saveTextOnClick(event) {
  updateObject();    
  setUneditable(); 
  document.body.removeEventListener('keypress', saveTextOnEnter);
  event.target.removeEventListener('blur', saveTextOnClick);
}

function saveTextOnEnter(event) {
  if (event.code === 'Enter') {
    updateObject();    
    setUneditable(); 
    document.body.removeEventListener('keypress', saveTextOnEnter);
    event.target.removeEventListener('blur', saveTextOnClick);
  }
}

function setEditable() {
  event.target.contentEditable = true;
}

function setUneditable() {
  event.target.contentEditable = false;
}

function testTextFields() {
  checkTextFields();
  textInputs[0].addEventListener('input', checkTextFields);
  textInputs[1].addEventListener('input', checkTextFields);
}

function updateCard() {
  if (event.target.classList.contains('js-text')) {
    setEditable();
    document.body.addEventListener('keypress', saveTextOnEnter);
    event.target.addEventListener('blur', saveTextOnClick);
  }
}

function updateObject() {
  var index = findIndexNumber(event.target.parentElement.dataset.id);
  if (event.target.classList.contains('title')) {
    photosArray[index].updateText(event.target.innerText, 'title');
  } else {
    photosArray[index].updateText(event.target.innerText, 'caption');
  }
  photosArray[index].saveToStorage(photosArray);
}






// function to get unique IDs from cards using event target
function getCardID(target) {
  return objId = target.dataset.id;
}

// function to get array index using unique ID
function getArrayIndex(array, objId) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id === objId) {
      return i
    }
  }
}

// when you filter, delete cards you don't need from the DOM but keep in array/storage
// as you back out of filter, create cards again by accessing cards that should be shown again in the array
// so search/filter really needs to check the text inside each object instance, not in the HTML.
// shown array is constantly updated but photosArray holds all instances


// Search/filter functionality
function searchObjectText(array, input) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    if ((array[i].title.toLowerCase().indexOf(input) != -1) || (array[i].caption.toLowerCase().indexOf(input) != -1)) {
      newArray.push(array[i]);
    }
  }
  return newArray
}

function liveSearch() {
  removeAllCards();
  var searchInput = this.value;
  var shownArray = searchObjectText(photosArray, searchInput);
  shownArray = sortShownArray(shownArray);
  for (var i = 0; i < shownArray.length; i++) {
    createCard(shownArray[i]);
  };   
};

function sortShownArray(array) {
  array.sort(function(a, b) {
    var idA = a.id;
    var idB = b.id;
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
  });
  return array
}

function removeAllCards() {
  cardSection.innerHTML = '';
}


// Show cards functionality
function showCards() {
  var allCards = Array.from(document.querySelectorAll('.photo-card'));
  if (event.target.innerText === 'Show More...') {
    event.target.innerText = 'Show Less...';
    allCards.forEach((card, i) => {
      card.classList.remove('hidden');
    });
  } else {
    event.target.innerText = 'Show More...';
    showRecentCards();
  }
}

function showRecentCards() {
  var allCards = Array.from(document.querySelectorAll('.photo-card'));
  var showButton = document.querySelector('.show-button');
  if (photosArray.length >= 10) {
    enableButton(showButton);
    allCards.forEach((card, i) => {
      if (i < 10) { 
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });  
  } else {
    disableButton(showButton);
  }
}








