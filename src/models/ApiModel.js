class ApiModel {}
class ApiMethod {}

function urlSafe(str) {
  return encodeURI(str.toLowerCase().replace(/\s+/g,"-"));
}

class ApiParam {
  constructor(param) {
    this.param = param;
  }

  name() {
    return this.param.name;
  }

  defaultValue() {
    return this.param.example || '';
  }

  required() {
    return this.param.required;
  }

  description() {
    return this.param.description;
  }

  schemaType() {
    if (this.param.schema) {
      return this.param.schema.type;
    } else {
      return this.param.type;
    }
  }

  schema() {
    return this.param.schema || {};
  }

  subParams() {
    const requiredFields = this.schema().required || [];
    if(this.schemaType() == 'object') {
      const propsObj = this.schema().properties || {};
      return Object.entries(propsObj).map(entry => {
        const [name, param] = entry;
        param.name = name;
        param.required = requiredFields.indexOf(name) >= 0;
        return new ApiParam(param);
      }
      );
    } else {
      return [];
    }
  }
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
    return this.descriptor.operationId || urlSafe(this.method + this.path.replace(/\//g, '-').replace(/\{/g, '(').replace(/\}/g, ')'));
  }

  title() {
    return this.descriptor.summary;
  }

  url() {
    return "/" + this.id();
  }

  description() {
    return this.descriptor.description || '';
  }

  submit(fields) {
    console.log("Submitting fields");
    console.log(fields);
  }

  params() {
    return this.descriptor.parameters.map(p => new ApiParam(p));
  }

  formObject() {
    const paramsList = this.params();
    var form = {}
    paramsList.forEach(p => form[p.name()] = p.defaultValue());
    return form;
  }
}

class ApiCategory {
  constructor(api, name, description, methods) {
    this.api = api;
    this._name = name;
    this._description = description;
    this._methods = methods;
  }

  id() {
    return this._name;
  }

  title() {
    return this._name.charAt(0).toUpperCase() + this._name.substr(1);
  }

  url() {
    return "/" + this._name; // TODO: make URL safe
  }

  methods() {
    return this._methods;
  }
}

function swaggerBasePath(swagger) {
  return (swagger.schemes[0] + "://" + swagger.host + swagger.basePath).replace(/\/$/, '');
}

// ONly partial implementition of https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03
function findRef(obj, jsonRef) {
  const path = jsonRef.split('/');

  const ref = path.reduce((current, p) => {
    if (p == '#') return obj;
    return current[p];
  }, obj);
  
  return ref;
}

/** Resolves method definition references using global definitions object */
function resolveDefinitions(schema, swagger) {
  if (schema['$ref']) {
    return resolveDefinitions(findRef(swagger, schema['$ref']), swagger);
  } else {
    let result = {};
    Object.entries(schema).forEach(entry => {
      const [id, obj] = entry;
      if (Array.isArray(obj) || (typeof obj != 'object')) {
        result[id] = obj;        
      } else {
        result[id] = resolveDefinitions(obj, swagger);
      }
    });

    return result;
  }
}

/** Resolves method definition references using global definitions object */
function resolveMethodDefinitions(methodDescriptor, swagger) {
  let update = {};
  
  if (methodDescriptor.parameters) {
    update.parameters = methodDescriptor.parameters.map(p => {
      if (p.schema) return Object.assign(p, { schema: resolveDefinitions(p.schema, swagger) })
      return p;
    })
  }

  if (methodDescriptor.responses) {
    let responses = {};
    Object.entries(methodDescriptor.responses).forEach( entry => {
      const [code, descriptor] = entry;
      if (descriptor.schema) {
        responses[code] = resolveDefinitions(descriptor.schema, swagger);
      } else {
        responses[code] = descriptor;
      }
    })

    update.responses = responses;
  }

  return Object.assign(methodDescriptor, update);
}

/** Returns Swagger API methods list */
function listMethods(swagger) {
  // remove trailing slash
    const base = swaggerBasePath(swagger);

    const methods = Object.entries(swagger.paths).map ( entry => {
      const [path, methods] = entry;    
      return Object.entries(methods).map( methodEntry => {
        const [method, descriptor] = methodEntry;
        return new SwaggerApiMethod(method, base, path, resolveMethodDefinitions(descriptor, swagger));
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
    this._swagger = swagger;
    this._categories = buildCategories(this, swagger);
  }

  title() {
    return this._swagger.info.title || "Swagger API";
  }

  version() {
    return this._swagger.info.version || "";
  }

  categories() {
    return this._categories;
  }

  categoryById(id) {
    return this._categories.find(e => e.id() == id);
  }
};

export { ApiModel, ApiMethod, ApiCategory, ApiParam };
export default SwaggerApi;