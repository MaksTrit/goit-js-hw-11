import { Notify } from 'notiflix';
import axios from 'axios';
import refs from './refs';

const instanceAxios = axios.create({
  baseURL: 'https://pixabay.com/api/',
});



// Запит на API=====================================
export async function getImages(pg, lmt, sQ) {
  try {
    const searchParams = new URLSearchParams({
    key: refs.API_KEY,
    q: sQ,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    page: pg,
    per_page: lmt,
    });
    const response = await instanceAxios.get(`?${searchParams}`);
    return  response.data  
  } catch (error) {      
    Notify.failure(error.message)
  }  
}