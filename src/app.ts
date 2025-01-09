import dotenv from 'dotenv';
import cors from 'cors';
import express, {Request, Response, Express, NextFunction} from 'express';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(
  '/api-docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({
    swaggerOptions: {
      url: '/openapi.json',
    },
  }),
);

app.get('/', (req: Request, res: Response) => {
  res.send('Sweepic');
});

app.get(
  '/openapi.json',
  async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.ignore = true
    const options = {
      openapi: '3.0.0',
      disableLogs: true,
      writeOutputFile: false,
    };
    const outputFile = '/dev/null'; // 파일 출력은 사용하지 않습니다.
    const routes = ['./src/app.ts']; // swagger-autogen이 분석할 파일 경로입니다.
    const doc = {
      info: {
        title: 'Sweepic API',
        description: 'Sweepic 프로젝트입니다.',
      },
      host: 'localhost:3000',
    };

    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
  },
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
