class Photo {
  constructor(title, caption, file, favorite) {
    this.id = Date.now;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage() {

  }

  deleteFromStorage() {

  }

  updatePhoto() {

  }

  updateFavorite() {
    
  }
}
