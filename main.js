const addToAlbumButton = document.getElementById('js-add-to-album');
const cardSection = document.querySelector('.card-section');
const chooseFileButton = document.getElementById('photo-input');
const searchInput = document.getElementById('js-search');
const showButton = document.querySelector('.show-button');
const textInputs = document.querySelectorAll('.text-inputs');
const viewFavoritesButton = document.getElementById('js-view-favorites');
let photosArray = [];
let reader = new FileReader();

window.addEventListener('load', createCardsOnReload);
chooseFileButton.addEventListener('change', getPhoto);
cardSection.addEventListener('dblclick', updateCard);
addToAlbumButton.addEventListener('click', () => {
  saveNewPhotoCard(textInputs[0].value, textInputs[1].value);
});
searchInput.addEventListener('keyup', liveSearch);
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

function clearInputs() {
  textInputs.forEach(photo => {
    photo.value = '';
  });
  document.querySelector('#photo-input').value = '';
} 

function createCards(cardArray) {
  cardArray.forEach((card, i) => {
    const cardHTML = `
      <div class="photo-card" data-id=${card.id}>
        <p class="js-text title">${card.title}</p>
        <label class="photo-label" for="change-photo${i}">
          <img class="photo" src="${card.file}" alt="user uploaded photo">
        </label>
        <input class="choose-input card-photo" type="file" accept="image/*" name="change-photo" id="change-photo${i}" aria-label="choose a new photo from your computer to update this photo card">
        <p class="js-text caption">${card.caption}</p>
        <section class="card-footer">
          <button class="icon-buttons delete-button"></button>
          <button class="icon-buttons favorite-button favorite-${card.favorite}"></button>
        </section>
      </div>`;
    cardSection.insertAdjacentHTML('afterbegin', cardHTML);
  });
  favoritesCount();
}

function createCardsOnReload() {
  if (localStorage.hasOwnProperty('array')) {
    const parsedCard = JSON.parse(localStorage.getItem('array'));
    parsedCard.forEach(object => {
      const photoObj = new Photo(
        object.title, 
        object.caption, 
        object.file, 
        object.favorite, 
        object.id
      );
      photosArray.push(photoObj);
    });
    removeCardPlaceholder();
    showRecentCards();
  } else {
    addCardPlaceholder();
  }
}

function deleteCard() {
  const objectId = event.target.parentElement.parentElement.dataset.id;
  const index = findIndexNumber(objectId);
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

function enableButton(button) {
  button.disabled = false;
}

function favoritesCount() {
  const favorites = photosArray.filter(photo => {
    return photo.favorite === true
  });
  const counter = favorites.length;
  if (viewFavoritesButton.innerText.indexOf('Favorites') !== -1) {
    viewFavoritesButton.innerHTML = `
      View <span id="js-favorite-counter">${counter}</span> Favorites
      `;
  }
  return counter;
}

function findFavorites() {
  const newArray = photosArray.filter(photo => {
    return photo.favorite === true
  });
  return newArray
}

function findIndexNumber(objId) {
  return photosArray.findIndex(photo => {
    return photo.id === parseInt(objId)
  });
}

function favoriteCard() {
  const index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  photosArray[index].updateFavorite();
  photosArray[index].saveToStorage(photosArray);
  favoritesCount();
  if (photosArray[index].favorite) {
    event.target.classList.add('favorite-true');
  } else {
    event.target.classList.remove('favorite-true');
  }
}

function favoritesSearch(input) {
  const favoritesArray = findFavorites();
  const shownArray = searchObjectText(favoritesArray, input);
  createCards(shownArray);
}

function getPhoto(event) {
  reader.readAsDataURL(event.target.files[0]);
  testTextFields();
}

function liveSearch() {
  removeAllCards();
  const searchInput = this.value;
  if (viewFavoritesButton.innerHTML === 'View All Photos') {
    favoritesSearch(searchInput);
    return
  }
  const shownArray = searchObjectText(photosArray, searchInput);
  createCards(shownArray);  
}

function removeAllCards() {
  cardSection.innerHTML = '';
}

function removeCardPlaceholder() {
  const placeholder = document.querySelector('.card-placeholder');
  if (!placeholder.classList.contains('hide-placeholder')) {
    placeholder.classList.add('hide-placeholder');
  }
}

function removeTextInputListeners() {
  textInputs[0].removeEventListener('input', checkTextFields);
  textInputs[1].removeEventListener('input', checkTextFields);
}

function removeSaveTextListeners() {
  document.body.removeEventListener('keypress', saveTextOnEnter);
  event.target.removeEventListener('blur', saveTextOnClick);
}

function saveNewPhotoCard(title, caption) {
  event.preventDefault();
  const photoObj = new Photo(title, caption, reader.result);
  photosArray.push(photoObj);
  photoObj.saveToStorage(photosArray);
  disableButton(addToAlbumButton);
  removeCardPlaceholder();
  clearInputs();
  removeTextInputListeners();
  showRecentCards();
}

function saveTextOnClick() {
  updateObject();    
  setUneditable(); 
  removeSaveTextListeners();
}

function saveTextOnEnter(event) {
  if (event.code === 'Enter') {
    updateObject();    
    setUneditable(); 
    removeSaveTextListeners();
  }
}

function searchObjectText(array, input) {
  return array.filter(photo => {
    return (photo.title.toLowerCase().indexOf(input) !== -1) || (photo.caption.toLowerCase().indexOf(input) !== -1)
  });
}

function setEditable() {
  event.target.contentEditable = true;
}

function setUneditable() {
  event.target.contentEditable = false;
}

function showCards() {
  removeAllCards();
  const showMore = toggleShowButton();
  if (showMore) {
    showAllCards();
  } else {
    showRecentCards();
  }
}

function showFavorites() {
  event.preventDefault();
  removeAllCards();
  const yesFavorites = toggleFavoritesButton();
  if (yesFavorites) {
    createCards(findFavorites());
    disableButton(showButton);
  } else {
    showAllCards();
  }
}

function showAllCards() {
  removeAllCards();
  createCards(photosArray);
  if (photosArray.length > 10) {
    enableButton(showButton);
    showButton.innerText = 'Show Less...';
  }
}

function showRecentCards() {
  removeAllCards();
  if (photosArray.length <= 10) {
    createCards(photosArray);
    disableButton(showButton);
  } else {
    enableButton(showButton);
    const shownArray = photosArray.slice(photosArray.length - 10, photosArray.length); 
    createCards(shownArray);
    showButton.innerText = 'Show More...';
  }
}

function testTextFields() {
  checkTextFields();
  textInputs[0].addEventListener('input', checkTextFields);
  textInputs[1].addEventListener('input', checkTextFields);
}

function toggleFavoritesButton() {
  const counter = favoritesCount();
  if (viewFavoritesButton.innerHTML === `
    View <span id="js-favorite-counter">${counter}</span> Favorites
    `) {
    viewFavoritesButton.innerHTML = 'View All Photos';
    return true
  } else {
    viewFavoritesButton.innerHTML = `
    View <span id="js-favorite-counter">${counter}</span> Favorites
    `;
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

function updateObject() {
  const index = findIndexNumber(event.target.parentElement.dataset.id);
  if (event.target.classList.contains('title')) {
    photosArray[index].updateItem(event.target.innerText, 'title');
  } else {
    photosArray[index].updateItem(event.target.innerText, 'caption');
  }
  photosArray[index].saveToStorage(photosArray);
}

function updatePhoto(event) {
  const imgElement = event.target.previousElementSibling.firstElementChild;
  const objId = event.target.parentElement.dataset.id;
  const index = findIndexNumber(objId);
  
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = event => {
    updatePhotoURL(event, index, imgElement)
  }
}

function updatePhotoURL(event, i, element) {
  photosArray[i].updateItem(event.target.result, 'file');
  photosArray[i].saveToStorage(photosArray);
  element.src = reader.result;
}




