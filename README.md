# be-your-home-office

## What was done?

* Product Service Serverless config contains configuration for 2 lambda functions
* The getProductsById and getProductsList lambda functions return a correct response code
* Frontend application is integrated with product-service, products are represented in the app.

## Additional scope:

* +5 - ES6 modules are used for Product Service implementation
* +4 - Custom Webpack/ESBuild/etc is manually configured for Product Service. Not applicable for preconfigured/built-in bundlers that come with templates, plugins, etc.
* +4 - SWAGGER documentation is created for Product Service
* +4 - Lambda handlers are covered by basic UNIT tests (NO infrastructure logic is needed to be covered)
* +4 - Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.
* +4 - Main error scenarios are handled by API ("Product not found" error).

Link to product-service API: https://52m4snbje6.execute-api.eu-west-1.amazonaws.com

Link to FE MRs: https://github.com/daniiilponomarev/fe-your-home-office/pulls

### Get all products:

GET https://52m4snbje6.execute-api.eu-west-1.amazonaws.com/products

### Get product by ID:

GET https://52m4snbje6.execute-api.eu-west-1.amazonaws.com/products/{id}
