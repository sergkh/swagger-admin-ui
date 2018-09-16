class ApiModel {}
class ApiMethod {}

function urlSafe(str) {
  return encodeURI(str.toLowerCase().replace(/\s+/g,"-"));
}

class SwaggerApiMethod extends ApiMethod {
  constructor(method, baseUrl, path, descriptor) {
    super();
    this.method = method;
    this.baseUrl = baseUrl;
    this.path = path;
    this.descriptor = descriptor;
  }

  id() {
    return urlSafe(this.method + this.path.replace(/\//g, '-').replace(/\{/g, '(').replace(/\}/g, ')'));
  }

  title() {
    return this.descriptor.summary;
  }

  url() {
    return "/" + this.id();
  }

  description() {
    return this.descriptor.description;
  }

  submit(fields) {
    console.log("Submitting fields");
    console.log(fields);
  }

  params() {
    return this.descriptor.parameters;
  }
}

class ApiCategory {
  constructor(api, name, description, methods) {
    this.api = api;
    this.name = name;
    this.description = description;
    this.methods = methods;
  }

  id() {
    return this.name;
  }

  title() {
    return this.name.charAt(0).toUpperCase() + this.name.substr(1);
  }

  url() {
    return "/" + this.name; // TODO: make URL safe
  }
}

function swaggerBasePath(swagger) {
  return (swagger.schemes[0] + "://" + swagger.host + swagger.basePath).replace(/\/$/, '');
}

/** Returns Swagger API methods list */
function listMethods(swagger) {
  // remove trailing slash
    const base = swaggerBasePath(swagger);

    const methods = Object.entries(swagger.paths).map ( entry => {
      const [path, methods] = entry;    
      return Object.entries(methods).map( methodEntry => {
        const [method, descriptor] = methodEntry;
        return new SwaggerApiMethod(method, base, path, descriptor);
      }); 
    });

    // basically flat(), but with Safari support
    return methods.reduce((acc, val) => acc.concat(val), []);
  }

function buildCategories(api, swagger) {
  const tags = swagger.tags;
  const methods = listMethods(swagger);
  
  const groupedByTag = methods.reduce(function(acc, item) {  
    const tags = item.descriptor.tags || [""];

    tags.forEach(tag => {
      acc[tag] = acc[tag] || [];
      acc[tag].push(item);        
    });

    return acc;
  }, {});

  const categories = Object.entries(groupedByTag).map ( entry => {
    const [tag, methods] = entry;
    const tagInfo = tags.find(t => t.name == tag);
    const description = tagInfo ? tagInfo.description : "No description";
    const name = tag.length > 0? tag : "other";
    return new ApiCategory(api, name, description, methods);
  });

  return categories.sort((l, r) => {
    return ( ( l.name == r.name ) ? 0 : ( ( l.name > r.name ) ? 1 : -1 ) );
  });
}


class SwaggerApi extends ApiModel {

  constructor(swagger) {
    super();
    this.swagger = swagger;
    this.categories = buildCategories(this, swagger);
  }

  title() {
    return this.swagger.info.title || "Swagger API";
  }

  version() {
    return this.swagger.info.version || "";
  }
};

export { ApiModel, ApiMethod, ApiCategory };
export default SwaggerApi;