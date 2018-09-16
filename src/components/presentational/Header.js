import React from "react";
import { ApiModel } from "../../models/ApiModel";
import PropTypes from "prop-types";

const Header = ({ api }) => {

  console.log(api.title());

  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">{api.title()}</a>
        <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"></input>
        <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
            <a className="nav-link" href="#">Log in</a>
        </li>
        </ul>
    </nav>
  );

}

Header.propTypes = {
  api: PropTypes.instanceOf(ApiModel).isRequired
};

export default Header;