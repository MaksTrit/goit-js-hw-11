import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import refs from "./refs";

const lightbox = new simpleLightbox('.gallery a');

// Розмітка галереї=====================================
export function createMarkupGallery(arr) {
   const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="180"/>
      </a>      
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
           ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>`
  }).join("");
  refs.gallery.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();

  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}