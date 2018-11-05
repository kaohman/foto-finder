var addToAlbumButton = document.getElementById('js-add-to-album');
var cardSection = document.querySelector('.card-section');
var chooseFileButton = document.getElementById('photo-input');
var showButton = document.querySelector('.show-button');
var textInputs = document.querySelectorAll('.text-inputs');
// var updatePhotoButton = document.getElementById('change-photo');
var viewFavoritesButton = document.getElementById('js-view-favorites');
var photosArray = [];

// FIND A WAY TO KEEP THESE LOCAL
var photoURL; 
var favoriteCounter = 0;

window.addEventListener('load', createCardsOnReload);
chooseFileButton.addEventListener('change', getPhoto);
cardSection.addEventListener('dblclick', updateCard);
addToAlbumButton.addEventListener('click', function() {
  saveNewPhotoCard(textInputs[0].value, textInputs[1].value, photoURL);
});
document.getElementById('js-search').addEventListener('keyup', liveSearch);
showButton.addEventListener('click', showCards);
viewFavoritesButton.addEventListener('click', showFavorites);

cardSection.addEventListener('click', event => {
  if (event.target.classList.contains('delete-button')) {
    deleteCard(event);
  } else if (event.target.classList.contains('favorite-button')) {
    favoriteCard(event);
  } 
});

cardSection.addEventListener('change', event => { 
    updatePhoto(event);
});

function updatePhoto(event) {
  var newPhotoUrl = convertPhotoFile(event.target.files[0]);
  var objId = event.target.parentElement.dataset.id;
  var index = findIndexNumber(objId);
  photosArray[index].updatePhoto(newPhotoUrl);
  photosArray[index].saveToStorage(photosArray);
  var imgElement = event.target.previousElementSibling.firstElementChild;
  imgElement.src = newPhotoUrl;
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

function createCards(array) {
  favoriteCounter = 0;
  array.reverse()
  for (var i = 0; i < array.length; i++) {
    if (array[i].favorite) {
      var favorited = 'favorite-button-active';
      updateCounter(true);
    } else {
      var favorited = '';
    }
    var cardHTML = `
      <div class="photo-card" data-id=${array[i].id}>
        <p class="js-text title">${array[i].title}</p>
        <label class="photo-label" for="change-photo${i}">
          <img class="photo" src="${array[i].file}" alt="user uploaded photo">
        </label>
        <input class="choose-input card-photo" type="file" accept="image/*" name="change-photo" id="change-photo${i}">
        <p class="js-text caption">${array[i].caption}</p>
        <section class="card-footer">
          <button class="icon-buttons delete-button"></button>
          <button class="icon-buttons favorite-button ${favorited}"></button>
        </section>
      </div>`;
    cardSection.insertAdjacentHTML('afterbegin', cardHTML);
  }
}

function createCardsOnReload() {
  if(localStorage.hasOwnProperty('array')) {
    var parsedCard = JSON.parse(localStorage.getItem('array'));
    parsedCard.forEach(function(object) {
      var photoObj = new Photo(object.title, object.caption, object.file, object.favorite, object.id);
      photosArray.push(photoObj);
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
  
  if(photosArray[index].favorite) {
    favoriteCounter--;
    document.getElementById('js-favorite-counter').innerText = favoriteCounter;
  }

  photosArray[index].deleteFromStorage(index);
  photosArray.splice(index, 1);
  event.target.closest('.photo-card').remove();
  showRecentCards(photosArray);
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

function findFavorites() {
  var newArray = [];
  for(var i = 0; i < photosArray.length; i++) {
    if (photosArray[i].favorite === true) {
      newArray.push(photosArray[i]);
    }
  }
  return newArray
}

function findFavoriteTarget(id) {
  var cards = cardSection.children;
  for (var i = 0; i < cards.length; i++) {
    if(parseInt(cards[i].dataset.id) === id) {
      return cards[i].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling;
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

function favoriteCard() {
  var cardTarget = event.target;
  var objectId = cardTarget.parentElement.parentElement.dataset.id;
  var index = findIndexNumber(objectId);
  photosArray[index].updateFavorite();
  photosArray[index].saveToStorage(photosArray);
  updateCounter(photosArray[index].favorite);
  if (photosArray[index].favorite) {
    event.target.classList.add('favorite-button-active');
  } else {
    event.target.classList.remove('favorite-button-active');
  }
}

function favoritesSearch(input) {
  var favoritesArray = sortShownArray(findFavorites());
  var shownArray = searchObjectText(favoritesArray, input);
  createCards(shownArray);
}

function getPhoto(event) {
  photoURL = convertPhotoFile(event.target.files[0]);
  testTextFields();
}

function liveSearch(array) {
  removeAllCards();
  var searchInput = this.value;
  if(viewFavoritesButton.innerHTML === 'View All Photos') {
    favoritesSearch(searchInput);
    return
  }
  if (searchInput === '') {
    showRecentCards();
    return
  }
  var shownArray = searchObjectText(photosArray, searchInput);
  shownArray = sortShownArray(shownArray);
  createCards(shownArray);  
}

function removeAllCards() {
  cardSection.innerHTML = '';
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

function searchObjectText(array, input) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    if ((array[i].title.toLowerCase().indexOf(input) != -1) || (array[i].caption.toLowerCase().indexOf(input) != -1)) {
      newArray.push(array[i]);
    }
  }
  return newArray
}

function setEditable() {
  event.target.contentEditable = true;
}

function setUneditable() {
  event.target.contentEditable = false;
}

function showCards() {
  removeAllCards();
  var showMore = toggleShowButton();
  if (showMore) {
    var showAll = photosArray.slice().reverse();
    createCards(showAll);
  } else {
    showRecentCards();
  }
}

function showFavorites() {
  event.preventDefault();
  removeAllCards();
  var showFavorites = toggleFavoritesButton();
  if (showFavorites) {
    var favoritesArray = sortShownArray(findFavorites());
    createCards(favoritesArray);
    disableButton(showButton);
  } else {
    var showAll = photosArray.slice().reverse();
    createCards(showAll);
    enableButton(showButton);
    document.getElementById('js-favorite-counter').innerText = favoriteCounter;
  }
}

function showRecentCards() {
  removeAllCards();
  if (photosArray.length <= 10) {
    var showAll = photosArray.slice().reverse();
    createCards(showAll);
    disableButton(showButton);
  } else {
    enableButton(showButton);
    var shownArray = photosArray.slice(photosArray.length-10, photosArray.length).reverse(); 
    createCards(shownArray);
    showButton.innerText = 'Show More...';
  }
}

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

function testTextFields() {
  checkTextFields();
  textInputs[0].addEventListener('input', checkTextFields);
  textInputs[1].addEventListener('input', checkTextFields);
}

function toggleFavoritesButton() {
  if (viewFavoritesButton.innerHTML === `View <span id="js-favorite-counter">${favoriteCounter}</span> Favorites`) {
    viewFavoritesButton.innerHTML = 'View All Photos';
    return true
  } else {
    viewFavoritesButton.innerHTML = `View <span id="js-favorite-counter">${favoriteCounter}</span> Favorites`;
    return false
  }
}

function toggleShowButton() {
  if (showButton.innerText === 'Show More...') {
    showButton.innerText = 'Show Less...';
    return true
  } else {
    showButton.innerText = 'Show More...';
    return false
  }
}

function updateCard() {
  if (event.target.classList.contains('js-text')) {
    setEditable();
    document.body.addEventListener('keypress', saveTextOnEnter);
    event.target.addEventListener('blur', saveTextOnClick);
  }
}

function updateCounter(bool) {
  if (bool) { 
    favoriteCounter++
  } else {
    favoriteCounter--
  }
  if (viewFavoritesButton.innerText.indexOf('Favorites') !== -1) {
    viewFavoritesButton.innerHTML = `View <span id="js-favorite-counter">${favoriteCounter}</span> Favorites`;
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



