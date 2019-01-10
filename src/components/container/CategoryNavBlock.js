import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {ApiCategory} from "../../models/ApiModel";

class CategoryNavBlock extends Component {

  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick(evt) {
    evt.preventDefault();
    this.setState({
      expanded: !this.state.expanded 
    });
  }

  render() {    
    const category = this.props.category;
    const baseUrl = category.url();
    const expanded = this.state.expanded;

    const links = () => {
        if (!expanded) return [];

        return category.methods().map(method => (
          <li key={method.id()} className="nav-item">
              <Link to={baseUrl + method.url() } className="nav-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  {method.title()}
              </Link>
          </li>
      ));
    }

    const openSvg = expanded ? 
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;

    return (
    <div>
        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>{category.title()}</span>
            <a className="d-flex align-items-center text-muted" href="#" onClick={this.handleExpandClick}>
              {openSvg}
            </a>
        </h6>
        <ul className="nav flex-column">
            {links()}
        </ul>
    </div>);
  }
}

CategoryNavBlock.propTypes = {
  category: PropTypes.instanceOf(ApiCategory).isRequired
};

export default CategoryNavBlock;