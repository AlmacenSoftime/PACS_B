const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        version: '1.0.0',            // by default: '1.0.0'
        title: 'PACS API',              // by default: 'REST API'
        description: 'API para el sistema PACS de Softime'         // by default: ''
    },
    host: 'localhost:3000',
    basePath: '/',            // by default: '/'
    schemes: ['http', 'https'],              // by default: ['http']
    consumes: ['application/json'],             // by default: 
    produces: ['application/json'],             // by default: ['application/json']
    tags: [                   // by default: empty Array
        {
            name: 'Autenticacion',             // Tag name
            description: ''       // Tag description
        },
        // { ... }
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header', // can be 'header', 'query' or 'cookie'
            name: 'Auth-Token', // name of the header, query parameter or cookie
            description: 'Token JWT'
        }
    },
    definitions: {
        loginRequest: {
            email: 'ejemplo@email.com',
            pasword: 'password'
        }
    }           // by default: empty object
};

const outputFile = './swagger.json';
const endpointsFiles = ['./dist/App.js', './dist/controllers/authentication/authentication.routes.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);

// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//     require('./index.js'); // Your project's root file
//   });

// EDITOR SWAGGER: https://editor-next.swagger.io/