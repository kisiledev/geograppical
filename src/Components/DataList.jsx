import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ExpandableProperty from './ExpandableProperty';

const RecursivePropertyContainer = styled.div`
  padding-top: 10px;
  padding-left: 3px;
  margin-left: 10px;
  ${props => props.excludeBottomBorder ? '' : 'border-bottom: 2px solid #eeeeee;'}
  color: #666;    
  font-size: 16px;
`;  

export const PropertyName = styled.span`
  color: black;
  font-size: 14px;
  font-weight: bold;
`;

const RecursiveProperty = props => {

    return (
        <RecursivePropertyContainer excludeBottomBorder={props.excludeBottomBorder}>
          {props.property ? (
            typeof props.property === 'number' ||
            typeof props.property === 'string' ||
            typeof props.property === 'boolean' ? (
              <React.Fragment>
                <PropertyName>{camelCaseToNormal(props.propertyName)}: </PropertyName>
                {props.property.toString()}
              </React.Fragment>
            ) : (
              <ExpandableProperty country={props.property} title={camelCaseToNormal(props.propertyName)} expanded={!!props.rootProperty}>
                {Object.values(props.property).map((property, index, { length }) => (
                  <RecursiveProperty
                    key={index}
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
};

const camelCaseToNormal = (str) => str.split("_").join(" ").replace(/([A-Z])/g, ' $1').replace(/^./, str2 => str2.toUpperCase());

RecursiveProperty.propTypes = {
    name: PropTypes.string
  };

export default RecursiveProperty;