import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PropertyName = styled.div`
  font-weight: bold;
  cursor: pointer;
  padding: 5px 0;
`;

const ExpandableProperty = (props) => {
    let [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setTrue(); 
    }, []);

    const setTrue = () => {
      if(props.country.name){
      setIsOpen(true);
    } else {
      return
    }
  }
  const toggleValue = () => {
    setIsOpen(!isOpen);
  }
      return (
        <React.Fragment>
          <PropertyName onClick={() => toggleValue()}>
            {props.title}
            {isOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
          </PropertyName>
          {isOpen ? props.children : null}
          {React.Children.count(props.children) === 0 && isOpen ? 'The list is empty!' : null}
        </React.Fragment>
      );
    }

  export default ExpandableProperty; 