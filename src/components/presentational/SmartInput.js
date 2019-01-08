import React, { Component } from "react";
import PropTypes from "prop-types";
import { ApiParam } from "../../models/ApiModel";
import Input from "./Input";
import ObjectInput from "./ObjectInput";

class SmartInput extends Component { 
  
  constructor(props) {
    super(props);
  }

  render() {
    const param = this.props.param;
    const name = param.name();
    const required = param.required();
    const schema = param.schemaType();
    const description = param.description();

    if (schema == 'object') {
      return (<ObjectInput 
                key={this.props.id}
                param={param}
                handleChange={this.props.handleChange}
                required={required}
              />);   
    } else {

      return (<Input 
                key={this.props.id} 
                label={name}
                text={description}
                id={name} 
                value={this.props.value} 
                handleChange={this.props.handleChange}
                required={required}
              />);
    }
  }
}

SmartInput.propTypes = {
  id: PropTypes.string.isRequired,
  param: PropTypes.instanceOf(ApiParam).isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default SmartInput;