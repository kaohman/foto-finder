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

  deleteFromStorage() {

  }

  updatePhoto() {

  }

  updateFavorite() {
    
  }
}
