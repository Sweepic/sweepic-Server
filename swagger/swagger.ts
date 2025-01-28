import swaggerAutogen from 'swagger-autogen';

const options = {
  openapi: '3.0.0',
  disableLogs: true,
  writeOutputFile: true,
};
const outputFile = './swagger/openapi.json';
const routes = ['./src/app.ts'];
const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Sweepic API',
    description: 'Sweepic 프로젝트입니다.',
    version: '1.0.0',
  },
  host: 'http://3.37.137.212:3000/',
};

swaggerAutogen(options)(outputFile, routes, doc);
