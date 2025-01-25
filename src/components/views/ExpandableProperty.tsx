import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CountryType } from "../../helpers/types/CountryType";

export const PropertyName = styled.div.attrs({
  role: "button",
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
        {isOpen ? (
          <FontAwesomeIcon icon={faAngleUp} />
        ) : (
          <FontAwesomeIcon icon={faAngleDown} />
        )}
      </PropertyName>
      {isOpen ? children : null}
      {React.Children.count(children) === 0 && isOpen
        ? "The list is empty!"
        : null}
    </>
  );
};
export default ExpandableProperty;
