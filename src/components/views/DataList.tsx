/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import styled from 'styled-components';
import ExpandableProperty from './ExpandableProperty';
import React from 'react';
import { CountryType } from '../../helpers/types/CountryType';

const camelCaseToNormal = (str: string) =>
  str
    .split('_')
    .join(' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str2) => str2.toUpperCase());

const RecursivePropertyContainer = styled.div<{
  excludeBottomBorder: boolean;
  children?: React.ReactNode;
}>`
  padding-top: 10px;
  padding-left: 3px;
  margin-left: 10px;
  ${(props) =>
    props.excludeBottomBorder ? '' : 'border-bottom: 2px solid #eeeeee;'}
  color: #666;
  font-size: 16px;
`;

export const PropertyName = styled.span`
  color: black;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

interface MappedProperty {
  [key: string]: RecursivePropertyProps['property'];
}
interface RecursivePropertyProps {
  property: CountryType | MappedProperty | string | number | boolean;
  propertyName: string;
  excludeBottomBorder: boolean;
  rootProperty: boolean;
  children?: React.ReactNode;
  expanded?: boolean;
}

const RecursiveProperty = (props: RecursivePropertyProps) => {
  return (
    <RecursivePropertyContainer excludeBottomBorder={props.excludeBottomBorder}>
      {props.property ? (
        typeof props.property === 'number' ||
        typeof props.property === 'string' ||
        typeof props.property === 'boolean' ? (
          <>
            <PropertyName>
              {`${camelCaseToNormal(props.propertyName)}: `}
            </PropertyName>
            {props.property}
          </>
        ) : (
          <ExpandableProperty
            country={props.property}
            title={camelCaseToNormal(props.propertyName)}
            expanded={!!props.rootProperty}
          >
            {Object.values(props.property).map(
              (property, index, { length }) => {
                return (
                  <RecursiveProperty
                    rootProperty={props.rootProperty}
                    key={`${index}`}
                    property={property as RecursivePropertyProps['property']}
                    propertyName={
                      Object.getOwnPropertyNames(props.property)[index]
                    }
                    excludeBottomBorder={index === length - 1}
                  />
                );
              }
            )}
          </ExpandableProperty>
        )
      ) : (
        'Property is empty'
      )}
    </RecursivePropertyContainer>
  );
};

export default RecursiveProperty;
