import React, { Component } from "react";
import PropTypes from "prop-types";
import {ApiMethod} from "../../models/ApiModel";
import GetForm from "./GetForm";
import PostForm from "./PostForm";
import DeleteForm from "./DeleteForm";

function formByMethod(method) {
  switch(method.method) {
    case "get": 
      return (<GetForm method={method} />);
    case "delete":
      return (<DeleteForm method={method} />);
    default:
      return (<PostForm method={method} />);
  }
}

class Page extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const method = this.props.method;
    const form = formByMethod(method);

    return (
    <div>
        <h1 className="h2">{method.title()}</h1>
        <div className="btn-toolbar mb-2 mb-md-0"></div>

        {form}    
    </div>);
  }
}

Page.propTypes = {
  method: PropTypes.instanceOf(ApiMethod).isRequired
};

export default Page;