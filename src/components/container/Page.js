import React, { Component } from "react";
import FormBuilder from "./FormBuilder";

class Page extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const method = this.props.method;
        return (
        <div>
            <h1 className="h2">{method.title()}</h1>
            <div className="btn-toolbar mb-2 mb-md-0"></div>
            <FormBuilder method={method} />
        </div>);
    }
}

export default Page;