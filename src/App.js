import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

import Photo from './Photo';
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;


function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [newImages, setNewImages] = useState(false);
  const [query, setQuery] = useState('');
  const fetchPhotos = async () => {
    setLoading(true);
    let url;
    const pageUrl = `&page=${page}`
    const queryUrl = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${pageUrl}${queryUrl}`;
    } else {
      url = `${mainUrl}${clientID}${pageUrl}`;
    }
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos(oldPhotos => {
        if (page === 1 && query) {
          return data.results
        } else if (query) {
          return [...oldPhotos, ...data.results]
        } else {
          return [...oldPhotos, ...data]
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [page])


  const event = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 2)) {
      setNewImages(true);
    }
  }

  useEffect(() => {
    if (!newImages) return
    setPage(oldPage => {
      return oldPage + 1
    })
  }, [newImages])

  useEffect(() => {
    window.addEventListener('scroll', event)
    return () => window.removeEventListener('scroll', event)
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return
    if (page === 1) {
      fetchPhotos();
      return
    }
    setPage(1);
  }

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            className='form-input'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
