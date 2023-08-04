import React from "react";
import ApplicationBar from "../components/ApplicationBar/ApplicationBar";


function Base(props){
    return(
      <div>
        <ApplicationBar login={props.login === undefined ? true : props.login}/>
        {props.children}
      </div>
    );
}

export default Base;
