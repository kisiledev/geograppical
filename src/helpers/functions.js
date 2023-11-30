import axios from 'axios';
import { useState } from 'react';
import { changeViewActionCreator } from '../redux-og';
import isoData from '../data/iso.json';

const simplifyString = (string) => {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/gi, '')
    .toUpperCase();
};

const removeIsoNull = (array) =>
  array.filter(
    (item) =>
      item.government.capital !== undefined &&
      item.government.country_name !== undefined &&
      item.government.country_name.isoCode !== undefined &&
      item.name
  );

const removeNull = (array) => {
  if (array !== undefined) {
    return array
      .filter(
        (item) =>
          item.government.capital !== undefined &&
          item.government.country_name !== undefined &&
          item.name
      )
      .map((item) => (Array.isArray(item) ? removeNull(item) : item));
  }
};
const loadCodes = (isoData) => {
  const codes = isoData;
  const isoCodes = codes.map((code) => {
    const container = {};
    container.name = code['CLDR display name'];
    container.shortName = code['UNTERM English Short'];
    container.isoCode = code['ISO3166-1-Alpha-3'];
    container.capital = code.Capital;
    return container;
  });
  return isoCodes;
};
const loadWorldData = () => {
  try {
    axios.get('../factbook.json').then((res) => {
      let Data = res && res.data.countries;
      // console.log(Data);
      Data = Object.values(Data).map((country) => country.data) || [];
      const newData = removeNull(Object.values(Data));
      if (newData.length > 0) {
        newData.forEach((element, index, nd) => {
          nd[index].geography.map_references = newData[
            index
          ].geography.map_references.replace(/;/g, '');
          if (nd[index].geography.map_references === 'AsiaEurope') {
            nd[index].geography.map_references = 'Europe';
          }
          if (nd[index].geography.map_references === 'Middle East') {
            nd[index].geography.map_references = 'Southwest Asia';
          }
        });
      }
      let loadediso = loadCodes(isoData);
      let countries = {};
      countries = newData;
      for (let i = 0, len = countries.length; i < len; i += 1) {
        countries[countries[i].name] = countries[i];
      }
      let codes = {};
      if (codes === undefined) {
        return console.log('unable to load');
      }
      codes = loadediso;
      if (codes && codes.length > 0) {
        for (let i = 0, len = codes.length; i < len; i += 1) {
          if (codes[i]) {
            codes[codes[i].name] = codes[i];
          }
        }
        let i = 0;
        const len = codes.length;
        for (i; i < len; i += 1) {
          if (countries[codes[i].name]) {
            countries[codes[i].name].government.country_name.isoCode =
              codes[i].isoCode;
          } else if (countries[codes[i].shortName]) {
            countries[codes[i].shortName].government.country_name.isoCode =
              codes[i].isoCode;
          }
        }
      }
      const x = removeIsoNull(countries);
      return x;
    });
  } catch (err) {
    console.log(err);
  }
};

const hoverOnCountry = (e, region, country) => {
  e.stopPropagation();
  let nodes = document.getElementsByClassName('country');
  nodes = [...nodes];
  nodes = nodes.filter(
    (y) =>
      simplifyString(country) === simplifyString(y.dataset.longname) ||
      simplifyString(country) === simplifyString(y.dataset.shortname)
  );
  console.log(nodes);
  console.log(country);
  nodes.forEach((node) => {
    node.style.fill = '#ee0a43';
    node.style.stroke = '#111';
    node.style.strokeWidth = 0.1;
    node.style.outline = 'none';
    node.style.willChange = 'all';
  });
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
