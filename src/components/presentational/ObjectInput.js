import React from "react";
import PropTypes from "prop-types";
import { ApiParam } from "../../models/ApiModel";
import Input from "./Input";

const ObjectInput = ({ param, handleChange, required }) => {
  const schema = param.schema();
  
  console.log(param);

  const requiredFields = schema.required || [];

  const inputs = Object.entries(schema.properties).map(entry => {
    const [id, config] = entry;
    const value = config.example || "nothing";
    const description = config.description || id;
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

}

ObjectInput.propTypes = {
  param: PropTypes.instanceOf(ApiParam).isRequired,
  required: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ObjectInput;