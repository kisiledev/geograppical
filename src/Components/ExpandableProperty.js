import React from 'react';
import styled from 'styled-components';

export const PropertyName = styled.div`
  color: #008080;
  font-size: 14px;
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
            {this.state.isOpen ? ' - ' : ' + '}
          </PropertyName>
          {this.state.isOpen ? this.props.children : null}
          {React.Children.count(this.props.children) === 0 && this.state.isOpen ? 'The list is empty!' : null}
        </React.Fragment>
      );
    }
  }