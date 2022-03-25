import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PropertyName = styled.div`
  font-weight: bold;
  cursor: pointer;
  padding: 5px 0;
  display: flex;
  align-items: center;
`;

const ExpandableProperty = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    country,
    title,
    children,
  } = props;

  const setTrue = () => {
    if (country.name) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    setTrue();
  }, []);
  const toggleValue = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <PropertyName onClick={() => toggleValue()}>
        {title}
        {isOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
      </PropertyName>
      {isOpen ? children : null}
      {React.Children.count(children) === 0 && isOpen ? 'The list is empty!' : null}
    </>
  );
};
ExpandableProperty.propTypes = {
  country: PropTypes.shape({
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
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};
export default ExpandableProperty;
