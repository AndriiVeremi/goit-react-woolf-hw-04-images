import { useEffect, useState } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { getCollection } from '../../api/pixabayAPI';
import { SearchBar } from '../SearchBar/SearchBar';
import { Loader } from '../Loader/Loader';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { Containers, Wrapper, Title, Images, Error } from './App.styled';
import Logo from '../../images/Pixabay.png';

export const App = () => {

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const onLoadCollection = async () => {
      
      try {
        setLoading(true);
        const data = await getCollection(query, page);
        const newCollection = data.data.hits;
  
        if (newCollection.length === 0) {
          return Report.warning(
            'Sorry',
            'Sorry, but no images were found for your request. Please try modifying your query and try again.',
            'Ok'
          );
        }
  
        if (page === 1) {
          Notify.info(`${data.data.total} images found.`);
        }
  
        const totalPages = Math.floor(data.data.total / 12);
  
        setCollection((prev) => ([...prev, ...newCollection]))
        setTotalPages(totalPages)
      } catch (error) {
        setError(error)
        Notify.error(`${error}`);
      } finally {
        setLoading(false)
      }
    };

    if(query.length !== 0 ) {
      onLoadCollection();
    }

  },[query, page])

  const onSubmit = data => {
    setQuery(data);
    setCollection([]);
    setPage(1);
    setTotalPages(0);
  };

  const openModal = largeImageURL => {
    setShowModal(true)
    setLargeImageURL(largeImageURL)
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onLoadMore = () => {
    setPage(page + 1)
  };

  return (
    <Containers>
      <SearchBar onSubmit={onSubmit} />

      {collection.length !== 0 && (
        <ImageGallery collection={collection} showModal={openModal} />
      )}

      {collection.length > 0 && page <= totalPages && (
        <Button loadMore={onLoadMore}>Load More...</Button>
      )}

      {collection.length === 0 && (
        <Wrapper>
          <Title>Enter your search query!</Title>
          <Images src={Logo} width="650" alt="search" />
        </Wrapper>
      )}

      {loading && <Loader />}

      {error && <Error>Oops.., error: {error}</Error>}

      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </Containers>
  );
};
