/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BreakpointProvider } from 'react-socks';
import { Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DataType, Message } from '../../helpers/types/index';
import * as ROUTES from '../../constants/Routes';
import Result from './Result';
import { db } from '../../firebase/firebase';
import '../../App.css';
import { CountryType } from '../../helpers/types/CountryType';
import { User } from 'firebase/auth';
import { useParams } from 'react-router';

interface SearchResultsProps {
  countries: CountryType[] | null;
  data: DataType;
  user: User | null;
  getCountryInfo: (country: string, capital: string) => void;
  changeView: Function;
  handleRefresh: Function;
  handleOpen: Function;
  login: Function;
  searchText: string;
}
const SearchResults = (props: SearchResultsProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState<Message>({
    link: '',
    linkContent: '',
    content: '',
    style: 'info'
  });
  const [alert, setAlert] = useState(false);
  const [show, setShow] = useState(false);

  const params = useParams();

  const {
    searchText,
    user,
    data,
    countries,
    changeView,
    getCountryInfo,
    handleOpen,
    handleRefresh,
    login
  } = props;

  useEffect(() => {
    handleRefresh(params.input);
    setLoadingState(false);
  }, [data]);

  return (
    <div className="row">
      <main className="col-md-9 px-5">
        {alert && show && (
          <Alert
            severity={message.style}
            action={
              <Link component={RouterLink} to={message.link}>
                {message.linkContent}
              </Link>
            }
          >
            {message.content}
          </Alert>
        )}
        <div className="col-12 text-center">
          {loadingState ? (
            <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="3x" />
          ) : searchText === '' ? (
            <h4 className="my-3">No search terms are entered</h4>
          ) : (
            <h4 className="my-3">
              Search Results for {data ? searchText : params.input}
            </h4>
          )}
        </div>
        {countries &&
          countries[0] &&
          countries.map((country) => (
            <Result
              filtered={countries[0]}
              getCountryInfo={getCountryInfo}
              name={country.name}
              subregion={country.geography.location}
              capital={country.government.capital.name}
              population={country.people.population.total}
              flagCode={country.government.country_name.isoCode}
              key={country.alpha3Code}
              country={country}
              user={user}
              setMessage={setMessage}
              setShow={setShow}
              message={message}
            />
          ))}
      </main>
    </div>
  );
};
export default SearchResults;
