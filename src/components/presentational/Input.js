import React from "react";
import PropTypes from "prop-types";

const Input = ({ label, text, id, value, handleChange, required }) => 
  (<div className="form-group">
    <label htmlFor={label}>{text}</label>
    <input
      type="text"
      className="form-control"
      id={id}
      value={value}
      onChange={handleChange}
      required={required}
    />
  </div>);

Input.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Input;