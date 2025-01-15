import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PropertyName = styled.div.attrs({
  role: 'button'
})<{
  onClick?: () => void;
  children?: React.ReactNode;
}>`
  font-weight: bold;
  cursor: pointer;
  padding: 5px 0;
  display: flex;
  align-items: center;
`;

interface ExpandablePropertyProps {
  title: string;
  expanded?: boolean;
  country?: any;
  children?: React.ReactNode;
}

const ExpandableProperty = (props: ExpandablePropertyProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTrue();
  }, [isOpen]);

  const setTrue = () => {
    if (props.country.name) {
      setIsOpen(isOpen);
    } else {
      return;
    }
  };
  return (
    <React.Fragment>
      <PropertyName onClick={() => setTrue()}>
        {props.title}
        {isOpen ? (
          <FontAwesomeIcon icon={faAngleUp} />
        ) : (
          <FontAwesomeIcon icon={faAngleDown} />
        )}
      </PropertyName>
      {isOpen ? props.children : null}
      {React.Children.count(props.children) === 0 && isOpen
        ? 'The list is empty!'
        : null}
    </React.Fragment>
  );
};

export default ExpandableProperty;
