import React from "react";
import PropTypes from "prop-types";
import { ApiParam } from "../../models/ApiModel";
import Input from "./Input";

const ObjectInput = ({ param, handleChange, required }) => {
  const schema = param.schema();
  console.log(schema);

  const requiredFields = schema.required || [];

  const inputs = Object.entries(schema.properties).map(entry => {
    const [id, config] = entry;
    const value = config.example || "nothing";
    
    <Input 
          key={param.name() + id}
          label={name}
          text={param.description}
          id={param.name() + id} 
          value={value} 
          handleChange={handleChange}
          required={required}
        />
  });

  return (<div className="form-group">
      Object input
  </div>);

}

ObjectInput.propTypes = {
  param: PropTypes.instanceOf(ApiParam).isRequired,
  required: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ObjectInput;