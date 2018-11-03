class Photo {
  constructor(title, caption, file, favorite, id) {
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage(array) {
    var arrayJSON = JSON.stringify(array);
    localStorage.setItem('array', arrayJSON);
  }

  deleteFromStorage(index) {
    var retrievedJSON = localStorage.getItem('array');
    var parsedObj = JSON.parse(retrievedJSON);
    parsedObj.splice(index, 1);

    if (parsedObj.length === 0) {
      localStorage.clear();
    } else {
      this.saveToStorage(parsedObj);
    }
  }

  findIndex(array, objId) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id === objId) {
        return i
      }
    }
  }

  updateText(newText, type) {
    this[type] = newText;
  }

  updatePhoto() {
    
  }

  updateFavorite() {
    this.favorite = !this.favorite;
  }
}
