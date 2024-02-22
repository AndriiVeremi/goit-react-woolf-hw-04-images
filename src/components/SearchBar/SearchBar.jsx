import { useState } from 'react';
import { Report } from 'notiflix/build/notiflix-report-aio';
import HederLogo from '../../images/SLogo.png';
import { Header, Forma, SearchBtn, Span, Input } from './SearchBar.styled';

export const SearchBar = ({ onSubmit }) => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = e => {
    console.log(e.target.value)
    setSearchQuery(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    searchQuery.trim() === ''
      ? Report.failure(
          'Sorry',
          'Sorry, but I dont know what to search for. Please enter your query in the search field, and Ill see what I can find.',
          'Ok'
        )
      : onSubmit(searchQuery) || reset();
  };

  const reset = () => {
    setSearchQuery('');
  };

  return (
    <Header>
      <img
        src={HederLogo}
        style={{ width: '60px', height: '40px', marginRight: '20px' }}
        alt="logo"
      />
      <Forma onSubmit={handleSubmit}>
        <SearchBtn type="submit">
          <Span className="button-label">Search</Span>
        </SearchBtn>
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </Forma>
    </Header>
  );
};
 