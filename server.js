'use strict';

require('dotenv').config();
const path = require('path');
const Hapi = require('hapi');
const fs = require('fs');
const Package = require('./package');

const server = new Hapi.Server({
  port: process.env.PORT
});

const routesPath = path.join(__dirname, 'routes');
const swaggerOptions = {
  info: {
    title: 'Forex Mobile API Documentation',
    version: Package.version,
    description: Package.description
  }
};


async function init() {
  try {
    // Register plugins
    await server.register([
      require('inert'),
      require('vision'),
      {
        plugin: require('hapi-swagger'),
        options: swaggerOptions
      }
    ]);
    
    // Register routes
    fs.readdirSync(routesPath)
      .filter(file => (fs.lstatSync(path.resolve(routesPath, file)).isFile()) && (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
      .forEach(file => {
        const route = require(path.join(routesPath, file));
        server.route(route);
      });

  
    // Start server
    await server.start();
    console.log(`Server running at ${server.info.uri}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

init();