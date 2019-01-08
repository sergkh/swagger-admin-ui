import React, { Component } from "react";
import PropTypes from "prop-types";
import SmartInput from "../presentational/SmartInput";
import { ApiMethod } from "../../models/ApiModel";

class PostForm extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = this.props.method.formObject();
  }
  
  handleChange(evt) {
    var update = {}
    update[evt.target.id] = evt.target.value;
    const form = Object.assign({}, this.state, update); 
    console.log(form);
    this.setState(form);
  }

  handleSubmit(evt) {
    this.props.method.submit(this.state);
    evt.preventDefault();
  }

  render() {
    const method = this.props.method;

    console.log(method.params());

    const inputs = method.params().map((param, index) => {
      const id = index.toString();    
      const value = this.state[param.name()];

      return (<SmartInput 
          key={id}
          id={id} 
          param={param}
          value={value}
          handleChange={this.handleChange} 
        />);
    });

    return (
      <div>
        <p title={method.description()}>{method.title()}</p>      
        <form id={method.id()} onSubmit={this.handleSubmit}>
          {inputs}    
          <button type="submit">Submit</button>      
        </form>
      </div>
    );
  }
}

PostForm.propTypes = {
  method: PropTypes.instanceOf(ApiMethod).isRequired
};

export default PostForm;