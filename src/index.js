import React from 'react';
import ReactDOM from 'react-dom';
import Application from "./components/container/Application";
import SwaggerApi from './models/ApiModel';

import testSwagger from "./petstore.json"

const applicationEl = document.getElementById("app");

const swagger = new SwaggerApi(testSwagger);

applicationEl ? ReactDOM.render(<Application api={swagger} />, applicationEl) : false;

if(module.hot) {
    module.hot.accept();
}