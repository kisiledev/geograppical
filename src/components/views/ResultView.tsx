import { useState } from "react";
import { Alert, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { DataType, Message } from "../../helpers/types/index";

import "../../App.css";
import SidebarView from "./SidebarView";
import Maps from "./Maps";
import Result from "./Result";

import { CountryType } from "../../helpers/types/CountryType";
import { User } from "firebase/auth";
import MediaQuery from "react-responsive";

interface ResultViewProps {
  user: User | null;
  data: DataType;
  countries: CountryType[] | null;
  mapVisible: string;
  changeMapView: () => void;
  changeView: (view: string) => void;
  getCountryInfo: (country: string) => void;
  handleSideBar: (string: string) => void;
  filterCountryByName: (name: string) => void;
  login: () => void;
}

const ResultView = (props: ResultViewProps) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<Message>({
    link: "",
    linkContent: "",
    content: "",
    style: "info",
  });

  const {
    user,
    data,
    countries,
    mapVisible,
    changeMapView,
    changeView,
    getCountryInfo,
    handleSideBar,
    filterCountryByName,
  } = props;

  const totalRegions = data.map((a) =>
    a.geography.map_references.replace(/;/g, "")
  );
  function getOccurrence(array: string[], value: string) {
    return array.filter((v) => v === value).length;
  }
  let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
  uniqueRegions = uniqueRegions.filter(Boolean);

  return (
    <div className="row">
      <main className="col-md-9 col-lg-12 px-0">
        {message && show && (
          <Alert
            severity={message.style || "warning"}
            action={
              <Link to={message.link} component={RouterLink}>
                {message.linkContent}
              </Link>
            }
          >
            {message.content}
          </Alert>
        )}
        <MediaQuery minWidth={768}>
          <Maps
            mapVisible={mapVisible}
            changeMapView={changeMapView}
            worldData={data}
            getCountryInfo={getCountryInfo}
          />
        </MediaQuery>
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
              setShow={setShow}
              setMessage={setMessage}
              message={message}
            />
          ))}
      </main>
      <MediaQuery maxWidth={768}>
        <SidebarView
          changeView={changeView}
          handleSideBar={handleSideBar}
          data={data}
          totalRegions={totalRegions}
          uniqueRegions={uniqueRegions}
          getOccurrence={getOccurrence}
          getCountryInfo={getCountryInfo}
          loadingState={false}
          filterCountryByName={filterCountryByName}
        />
      </MediaQuery>
    </div>
  );
};
export default ResultView;
