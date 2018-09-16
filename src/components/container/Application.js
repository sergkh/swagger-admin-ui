import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Page from "./Page";
import CategoryNavBlock from "./CategoryNavBlock";
import Header from "../presentational/Header";
import { ApiCategory, ApiModel } from "../../models/ApiModel";

const Navigation = ({categories}) => { 
    
  const catElements = categories.map (c => (
    <CategoryNavBlock key={c.id()} category={c} />
  ));

  return (
  <nav className="col-md-2 d-none d-md-block bg-light sidebar">
    <div className="sidebar-sticky">
      {catElements}
    </div>
  </nav>);
}

Navigation.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.instanceOf(ApiCategory)).isRequired
};

class Application extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const api = this.props.api;
        const categories = api.categories;

        const PageComponent = (p) => {
            return (route) => <Page method={p} route={route} />
        };

        const routes = categories.map (cat => 
            cat.methods.map(method => 
                (<Route key={cat.id() + method.id()} path={ cat.url() + method.url() } component={PageComponent(method)} />)
            )
        ).reduce((acc, val) => acc.concat(val), []); // .flat();

        return (<Router>
            <div>
                <Header api={api} />                
                <div className="container-fluid">
                    <div className="row">
                        <Navigation categories={categories} />
                        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">    
                            {routes}
                        </main>
                    </div>
                </div>
            </div>
        </Router>);
    }
}

Application.propTypes = {
  api: PropTypes.instanceOf(ApiModel).isRequired
};

export { Navigation };
export default Application;