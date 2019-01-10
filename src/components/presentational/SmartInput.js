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
    const schemaType = param.schemaType();
    const description = param.description();

    console.log("Param", param);

    if (schemaType == 'object') {
      const subParams = param.subParams();
      
      const inputs = subParams.map(param => {
        const id = param.name();
        const value = param.defaultValue();
                  
        return (<SmartInput 
            key={id}
            id={id} 
            param={param}
            value={value}
            handleChange={this.handleChange} 
        />);
      });

      return (<div className="form-group">{inputs}</div>);

/*      
      const inputs = subParams.map(entry => {
        const value = entry.example || "";
        const description = entry.description || id;
        const inputId = param.name() + "_" + id;
    
        return (<Input 
              key={inputId}
              label={name}
              text={description}
              id={inputId}
              value={value} 
              handleChange={handleChange}
              required={requiredFields.indexOf(id) >= 0}
            />);
      });
    
      return (<div className="form-group">
        {inputs}
      </div>);
*/
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