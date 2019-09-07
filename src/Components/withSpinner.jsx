import React from 'react';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const withSpinner = Comp => ({ isLoading, children, ...props}) => {
 if(isLoading){
  return <div className="mx-auto text-center"><FontAwesomeIcon icon={faSpinner} spin size="3x"/></div>
 } else {
  return (
   <Comp {...props}>
    {children}
   </Comp>
  )
 }
}

export default withSpinner;