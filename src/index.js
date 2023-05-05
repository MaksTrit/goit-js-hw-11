import { Notify } from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const instanceAxios = axios.create({
  baseURL: 'https://pixabay.com/api/',
});

const API_KEY = "36077112-43cb229e78c8e7c13f4644e0f";

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");

searchForm.addEventListener("submit", onSearch);
// loadMore.addEventListener("click", loadMoreImages);
loadMore.style.display = "none";

// Інфініті скролл. Ініціалізація
const observer = new IntersectionObserver(onIntersection, { threshold: 0.5 });

// Лайтбокс. Ініціалізація
const lightbox = new simpleLightbox('.gallery a');

let page = 1;
let limit = 40;
let searchQuery = "";


// Стартовий пошук========================
async function onSearch(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();  

  if (searchQuery !== inputValue) {
    gallery.innerHTML = "";
    page = 1;
    // loadMore.style.display = "none";
  };

  if (!inputValue) {
    return Notify.info("Please enter some value!");
  };

  searchQuery = inputValue;
  try {
    const response = await getImages();
  if (!response.totalHits) {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.")    
  }
    Notify.success(`Hooray! We found ${response.totalHits} images.`);  
    createMarkupGallery(response.hits);    
    page += 1;
    observer.observe(gallery.lastElementChild);
  // loadMore.style.display = "block";
  } catch (error) {
    Notify.failure(error.message);
  }  
}

// Запит на бекенд=====================================
async function getImages() {
  try {
    const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    page: page,
    per_page: limit,
    });
    const response = await instanceAxios.get(`?${searchParams}`);
    return  response.data  
  } catch (error) {
    Notify.failure(error.message)
  }
  
}

// Розмітка галереї=====================================
function createMarkupGallery(arr) {
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
  gallery.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();

  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

// Інфініті скрол========================================
async function onIntersection(entries) {
  if (entries[0].isIntersecting) {
    try {
    const response = await getImages();
    createMarkupGallery(response.hits);
    if (response.totalHits <= limit * page) {
    return Notify.warning("We're sorry, but you've reached the end of search results.")
      }
      
    observer.observe(gallery.lastElementChild);
    page += 1;
  } catch (error) {
    Notify.failure(error.message);
  }
  }
}


// Функція "Завантажити ще заображення"=====================================
async function loadMoreImages() {
  try {
     const response = await getImages();
     createMarkupGallery(response.hits);
     if (response.totalHits <= limit * page) {
     loadMore.style.display = "none";
     return Notify.warning("We're sorry, but you've reached the end of search results.")
     }     
    page += 1;    
  } catch (error) {
    Notify.failure(error.message)
  } 
}