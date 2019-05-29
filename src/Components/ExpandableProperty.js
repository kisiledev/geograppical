import React from 'react';
import styled from 'styled-components';
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PropertyName = styled.div`
  font-weight: bold;
  cursor: pointer;
`;

export default class ExpandableProperty extends React.Component {
    state = {
      isOpen: false
    };
  
    render() {
      return (
        <React.Fragment>
          <PropertyName onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
            {this.props.title}
            {this.state.isOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
          </PropertyName>
          {this.state.isOpen ? this.props.children : null}
          {React.Children.count(this.props.children) === 0 && this.state.isOpen ? 'The list is empty!' : null}
        </React.Fragment>
      );
    }
  }