import React from 'react';
import styled from 'styled-components';

interface RadioProps {
  className?: string;
  checked: boolean;
}
const Radio = ({ className, checked = false, ...props }: RadioProps) => (
  <RadioContainer className={className}>
    <HiddenRadio checked={checked} {...props} />
    <StyledRadio checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledRadio>
  </RadioContainer>
);
const RadioContainer = styled.div<{
  className?: string;
  children: React.ReactNode;
}>`
  display: inline-block;
  vertical-align: middle;
`;
const Icon = styled.svg.attrs(
  (props: { viewBox: string; children: React.ReactNode }) => ({
    viewBox: props.viewBox,
    children: props.children
  })
)`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;
const HiddenRadio = styled.input.attrs((props: { checked: boolean }) => ({
  type: 'radio',
  checked: props.checked
}))`
  border: 0;
  clip: rect (0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;
const StyledRadio = styled.div<{
  children: React.ReactNode;
  checked?: boolean;
}>`
    display: inline-block;
    width: 16px;
    height: 16px;
    background: ${(props) => (props.checked ? 'forestgreen' : 'darkgray')}
    border-radius: 50%;
    transition: all 150ms;
    ${HiddenRadio}:focus + & {
        box-shadow: 0 0 0 3px lightgreen;
    }
    ${Icon} {
        visibility: ${(props) => (props.checked ? 'visible' : 'hidden')}
    }
`;

export default Radio;
