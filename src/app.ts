
import dotenv from 'dotenv';
import cors from 'cors';
import express, { Request, Response, Express, NextFunction } from 'express';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sweepic Swagger',
      version: '1.0.0',
      description: 'Sweepic Swagger 입니다.'
    },
    servers: [
      {
        url: 'http://43.201.52.196:3000',
        description: '배포 서버',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const specs = swaggerJsDoc(options);

app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// app.use(
//   '/docs',
//   swaggerUiExpress.serve,
//   swaggerUiExpress.setup(
//     {},
//     {
//       swaggerOptions: {
//         url: '/openapi.json',
//       },
//     },
//   ),
// );

// app.get(
//   '/openapi.json',
//   async (req: Request, res: Response, next: NextFunction) => {
//     // #swagger.ignore = true
//     const options = {
//       openapi: '3.0.0',
//       disableLogs: true,
//       writeOutputFile: false,
//     };
//     const outputFile = '/dev/null'; // 파일 출력은 사용하지 않습니다.
//     const routes = ['./src/app.ts']; // swagger-autogen이 분석할 파일 경로입니다.
//     const doc = {
//       openapi: '3.0.0',
//       info: {
//         title: 'Sweepic API',
//         description: 'Sweepic 프로젝트입니다.',
//         version: '1.0.0',
//       },
//       host: '43.201.52.196:3000',
//     };
//     const result = await swaggerAutogen(options)(outputFile, routes, doc);
//     res.json(result ? result.data : null);
//   },
// );

app.get('/', (req: Request, res: Response) => {
  res.send('Sweepic');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
