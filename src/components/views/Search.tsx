import React from 'react';
import '../../App.css';

interface SearchProps {
  searchText: string;
  passInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Search = ({ searchText, passInput }: SearchProps) => {
  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type a country to begin"
          aria-label=""
          aria-describedby="basic-addon1"
          value={searchText}
          onChange={passInput}
        />
        <div className="input-group-append"></div>
      </div>
    </div>
  );
};

export default Search;
