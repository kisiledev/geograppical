import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { CountryType } from '../../helpers/types/CountryType';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

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
  country?: CountryType;
  children?: React.ReactNode;
}
const ExpandableProperty = (props: ExpandablePropertyProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { country = null, title, children } = props;

  useEffect(() => {
    const setTrue = () => {
      if (country?.name) {
        setIsOpen(true);
      }
    };
    setTrue();
  }, [country?.name]);
  const toggleValue = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <PropertyName onClick={() => toggleValue()}>
        {title}
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </PropertyName>
      {isOpen ? children : null}
      {React.Children.count(children) === 0 && isOpen
        ? 'The list is empty!'
        : null}
    </>
  );
};
export default ExpandableProperty;
