class Photo {
  constructor(title, caption, file, favorite, id) {
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage(array) {
    const arrayJSON = JSON.stringify(array);
    localStorage.setItem('array', arrayJSON);
  }

  deleteFromStorage(index) {
    const retrievedJSON = localStorage.getItem('array');
    const parsedObj = JSON.parse(retrievedJSON);
    parsedObj.splice(index, 1);
    this.saveToStorage(parsedObj);
  }

  updateItem(newItem, type) {
    this[type] = newItem;
  }

  updateFavorite() {
    this.favorite = !this.favorite;
  }
}
