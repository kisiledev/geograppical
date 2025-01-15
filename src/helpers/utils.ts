import axios from 'axios';
import isoData from '../data/iso.json';
import { DataType, FactbookData, IsoData, IsoDataContainer } from './types';
import { CountryType } from './types/CountryType';

export const simplifyString = (string: string) => {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/gi, '')
    .toUpperCase();
};
