import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input";
import {ApiMethod} from "../../models/ApiModel"

class FormBuilder extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const names = this.props.method.params().map(param => param.name)
    var form = {}
    names.forEach(v => form[v] = '');
    this.state = form;
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
      const name = param.name;
      const required = param.required ? true : false;
      const value = this.state[name];

      return (<Input 
                key={index} 
                label={name}
                text={param.description}
                id={name} 
                value={value} 
                handleChange={this.handleChange}
                required={required}
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

export default FormBuilder;