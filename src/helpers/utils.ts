import axios from 'axios';
import isoData from '../data/iso.json';
import {
  Country,
  DataType,
  FactbookData,
  IsoData,
  IsoDataContainer
} from './types';
import { CountryType } from './types/CountryType';

export const simplifyString = (string: string) => {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/gi, '')
    .toUpperCase();
};

const removeIsoNull = (array: DataType) =>
  array.filter(
    (item) =>
      item.government.capital !== undefined &&
      item.government.country_name !== undefined &&
      item.government.country_name.isoCode !== undefined &&
      item.name
  );

const removeNull = (array: DataType): CountryType | undefined => {
  if (array !== undefined) {
    console.log(
      array
        .filter(
          (item) =>
            item.government.capital !== undefined &&
            item.government.country_name !== undefined &&
            item.name
        )
        .map((item) => (Array.isArray(item) ? removeNull(item) : item))
    );
    return array
      .filter(
        (item) =>
          item.government.capital !== undefined &&
          item.government.country_name !== undefined &&
          item.name
      )
      .map((item) => (Array.isArray(item) ? removeNull(item) : item));
  }
  return undefined;
};
const loadCodes = (isoData: IsoData[]) => {
  const codes = isoData;
  const isoCodes = codes.map((code) => {
    const container: IsoDataContainer = {
      name: code['CLDR display name'],
      shortName: code['UNTERM English Short'],
      isoCode: code['ISO3166-1-Alpha-3'],
      capital: code.Capital
    };

    return container;
  });
  return isoCodes;
};

const hoverOffCountry = (e, region, country) => {
  e.stopPropagation();
  let nodes = document.getElementsByClassName('country');
  nodes = [...nodes];
  nodes = nodes.filter(
    (y) =>
      simplifyString(country) === simplifyString(y.dataset.longname) ||
      simplifyString(country) === simplifyString(y.dataset.shortname)
  );
  console.log(nodes);
  nodes.forEach((node) => {
    node.removeAttribute('style');
    node.style.fill = '#024e1b';
    node.style.stroke = '#111';
    node.style.strokeWidth = 0.1;
    node.style.outline = 'none';
    node.style.willChange = 'all';
  });
};
const hoverOnRegion = (e, region) => {
  let svgs = [];
  e.stopPropagation();
  console.log(region);
  const countries = Object.values(region)[2];
  console.log(countries);
  if (typeof countries === 'object') {
    svgs = countries.map((country) => simplifyString(country.name));
  }
  let nodes = document.getElementsByClassName('country');
  nodes = [...nodes];
  console.log(nodes);
  console.log(svgs);
  nodes = nodes.filter(
    (y) =>
      svgs.includes(simplifyString(y.dataset.longname)) ||
      svgs.includes(simplifyString(y.dataset.shortname))
  );
  console.log(nodes);
  nodes.forEach((node) => {
    node.style.fill = '#024e1b';
    node.style.stroke = '#111';
    node.style.strokeWidth = 0.1;
    node.style.outline = 'none';
    node.style.willChange = 'all';
  });
  // console.log(state[regionName])
  // console.log(state[regionName].open)
};
const hoverOffRegion = (e, region) => {
  let svgs = [];
  e.stopPropagation();
  console.log(region);
  const countries = Object.values(region)[2];
  if (typeof countries === 'object') {
    svgs = countries.map((country) => simplifyString(country.name));
  }
  let nodes = document.getElementsByClassName('country');
  nodes = [...nodes];
  nodes = nodes.filter(
    (y) =>
      svgs.includes(simplifyString(y.dataset.longname)) ||
      svgs.includes(simplifyString(y.dataset.shortname))
  );
  nodes.forEach((node) => {
    node.removeAttribute('style');
  });
};
const getCountryInfo = (e, name) => {
  e.preventDefault();
  let worldData = loadWorldData();
  const searchDB = Object.values(worldData);
  name = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/gi, '');
  const match = searchDB.filter(
    (country) =>
      simplifyString(country.name) === simplifyString(name) ||
      country.government.country_name.conventional_long_form.toUpperCase() ===
        name.toUpperCase()
  );
  if (!match || match.length === 0) {
    // setCountryDetail('error');
    //dispatch setCountryDetail
  }
  console.log(match);
  // setCountryDetail(match[0]);
  //dispatch setCountryDetail
};
//needs to be converted to redux action
const getResults = (results, e) => {
  let searchText;
  if (!searchText) {
    // setSearchText(results);
  } else {
    e.preventDefault();
    // setSearch(searchText);
  }
};

//convert to redux action
const filterCountryByName = (string) => {
  let worldData = loadWorldData();
  const searchDB = Object.values(worldData);
  console.log(searchDB);
  const match = searchDB.filter(
    (country) =>
      country.name.toUpperCase() === string.toUpperCase() ||
      country.name.toUpperCase().includes(string.toUpperCase()) ||
      country.government.country_name.conventional_long_form.toUpperCase() ===
        string.toUpperCase() ||
      country.government.country_name.conventional_long_form
        .toUpperCase()
        .includes(string.toUpperCase())
  );
  console.log(match);
  // setFilterNations(match);
  if (string.length > 0) {
    console.log(match);
    // setFilterNations(match);
    return match;
  }
  return null;
};

export {
  removeIsoNull,
  removeNull,
  loadCodes,
  loadWorldData,
  hoverOffCountry,
  hoverOnRegion,
  hoverOnCountry,
  hoverOffRegion,
  getCountryInfo,
  getResults,
  filterCountryByName
};
