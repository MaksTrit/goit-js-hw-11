import { Notify } from 'notiflix';
import { getImages } from './js/api';
import { createMarkupGallery } from './js/createMarkup';
import refs from './js/refs';


refs.searchForm.addEventListener("submit", onSearch);
refs.loadMore.style.display = "none";
// refs.loadMore.addEventListener("click", loadMoreImages);



export let page = 1;
export let limit = 40;
export let searchQuery = "";

// Інфініті скролл. Ініціалізація
const observer = new IntersectionObserver(onIntersection, { threshold: 0.5 });

// Інфініті скрол========================================
async function onIntersection(entries) {  
  if (entries[0].isIntersecting) {
    if (refs.gallery.children.length <= limit * (page-1)-1 ) {
      return Notify.warning("We're sorry, but you've reached the end of search results.")
    }
    observer.unobserve(refs.gallery.lastElementChild);
    try {
    const response = await getImages(page, limit, searchQuery);
    createMarkupGallery(response.hits);
    if (response.totalHits <= limit * page) {
    return Notify.warning("We're sorry, but you've reached the end of search results.")
      };
      
    observer.observe(refs.gallery.lastElementChild);
    page += 1;
  } catch (error) {
    Notify.failure(error.message);
  }
  }
}

// Стартовий пошук========================
async function onSearch(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();  
  if (searchQuery !== inputValue) {
    refs.gallery.innerHTML = "";
    page = 1;
    // refs.loadMore.style.display = "none";
  };

  if (!inputValue) {
    return Notify.info("Please enter some value!");
  };

  searchQuery = inputValue;
  try {
    const response = await getImages(page, limit, searchQuery);
  if (!response.totalHits) {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.")    
  }
    Notify.success(`Hooray! We found ${response.totalHits} images.`);  
    createMarkupGallery(response.hits);    
    page += 1;
    observer.observe(refs.gallery.lastElementChild);
  // loadMore.style.display = "block";
  } catch (error) {
    Notify.failure(error.message);
  }  
}

// Функція "Завантажити ще заображення по кліку на кнопку"=====================================
// async function loadMoreImages() {
//   try {
//      const response = await getImages(page, limit, searchQuery);
//      createMarkupGallery(response.hits);
//      if (response.totalHits <= limit * page) {
//      refs.loadMore.style.display = "none";
//      return Notify.warning("We're sorry, but you've reached the end of search results.")
//      }     
//     page += 1;    
//   } catch (error) {
//     Notify.failure(error.message)
//   } 
// }

