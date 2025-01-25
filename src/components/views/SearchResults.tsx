import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Alert, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { DataType, Message } from "../../helpers/types/index";
import Result from "./Result";
import "../../App.css";
import { CountryType } from "../../helpers/types/CountryType";
import { User } from "firebase/auth";
import { useParams } from "react-router";

interface SearchResultsProps {
  countries: CountryType[] | null;
  data: DataType;
  user: User | null;
  getCountryInfo: (country: string) => void;
  changeView: (view: string) => void;
  handleRefresh: (value: string) => void;
  handleOpen: () => void;
  login: () => void;
  searchText: string;
}
const SearchResults = (props: SearchResultsProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState<Message>({
    link: "",
    linkContent: "",
    content: "",
    style: "info",
  });
  const [show, setShow] = useState(false);

  const { input = "" } = useParams();

  const { searchText, user, data, countries, getCountryInfo, handleRefresh } =
    props;

  useEffect(() => {
    handleRefresh(input);
    setLoadingState(false);
  }, [data, handleRefresh, input]);

  return (
    <div className="row">
      <main className="col-md-9 px-5">
        {message && show && (
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
          ) : searchText === "" ? (
            <h4 className="my-3">No search terms are entered</h4>
          ) : (
            <h4 className="my-3">
              Search Results for {data ? searchText : input}
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
