import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
      title: 'Imtihani API'
    },
    host: 'localhost:3000',
    basePath: "/", 
    schemes: ['http'],
  };
  
  const outputFile = './swagger-output.json';
  const endpointsFiles = ['../../index.js'];
  
  swaggerAutogen(outputFile, endpointsFiles, doc);