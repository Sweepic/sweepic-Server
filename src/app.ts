import dotenv from 'dotenv';
import cors from 'cors';
import express, {Request, Response, Express, NextFunction} from 'express';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';
import {memoFolderRouter} from './routers/memo.router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req: Request, res: Response) => {
  res.send('Sweepic');
});

app.use(
  '/docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: '/openapi.json',
      },
    },
  ),
);

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
      openapi: '3.0.0',
      info: {
        title: 'Sweepic API',
        description: 'Sweepic 프로젝트입니다.',
        version: '1.0.0',
      },
      host: 'localhost:3000',
    };
    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
  },
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = success => {
    return res.json({resultType: 'SUCCESS', error: null, success});
  };

  res.error = ({errorCode = 'unknown', reason = null, data = null}) => {
    return res.json({
      resultType: 'FAIL',
      error: {errorCode, reason, data},
      success: null,
    });
  };

  next();
});

app.use('/memo', memoFolderRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    // 응답 헤더가 이미 클라이언트로 전송되었는지 확인
    return next(err); // 추가적인 응답을 보낼 수 없으므로 에러를 다음 미들웨어로 전달
  }
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || 'unknown',
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
