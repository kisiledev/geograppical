/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ExpandableProperty from './ExpandableProperty';

const camelCaseToNormal = (str) => str.split('_').join(' ').replace(/([A-Z])/g, ' $1').replace(/^./, (str2) => str2.toUpperCase());

const RecursivePropertyContainer = styled.div`
  padding-top: 10px;
  padding-left: 3px;
  margin-left: 10px;
  ${(props) => (props.excludeBottomBorder ? '' : 'border-bottom: 2px solid #eeeeee;')}
  color: #666;    
  font-size: 16px;
`;

export const PropertyName = styled.span`
  color: black;
  font-size: 14px;
  font-weight: bold;
`;

const RecursiveProperty = (props) => (
  <RecursivePropertyContainer excludeBottomBorder={props.excludeBottomBorder}>
    {props.property ? (
      typeof props.property === 'number'
      || typeof props.property === 'string'
      || typeof props.property === 'boolean' ? (
        <>
          <PropertyName>
            {camelCaseToNormal(props.propertyName)}
            :
          </PropertyName>
          {props.property.toString()}
        </>
        ) : (
          <ExpandableProperty country={props.property} title={camelCaseToNormal(props.propertyName)} expanded={!!props.rootProperty}>
            {Object.values(props.property).map((property, index, { length }) => (
              <RecursiveProperty
                key={property}
                property={property}
                propertyName={Object.getOwnPropertyNames(props.property)[index]}
                excludeBottomBorder={index === length - 1}
              />
            ))}
          </ExpandableProperty>
        )
    ) : (
      'Property is empty'
    )}
  </RecursivePropertyContainer>
);

RecursiveProperty.propTypes = {
  property: PropTypes.shape({
    name: PropTypes.string.isRequired,
    introduction: PropTypes.string.isRequired,
    geography: PropTypes.string.isRequired,
    people: PropTypes.string.isRequired,
    government: PropTypes.string.isRequired,
    economy: PropTypes.string.isRequired,
    energy: PropTypes.string.isRequired,
    communications: PropTypes.string.isRequired,
    transportation: PropTypes.string.isRequired,
    military_and_security: PropTypes.string.isRequired,
    terrorism: PropTypes.string.isRequired,
    transnational_issues: PropTypes.string.isRequired,
  }).isRequired,
  propertyName: PropTypes.string.isRequired,
  excludeBottomBorder: PropTypes.bool.isRequired,
  rootProperty: PropTypes.bool.isRequired,
};

export default RecursiveProperty;
