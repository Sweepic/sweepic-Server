import dotenv from 'dotenv';
import cors from 'cors';
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import swaggerUiExpress from 'swagger-ui-express';
import passport from 'passport';
import session from 'express-session';
import {PrismaSessionStore} from '@quixo3/prisma-session-store';
import {prisma} from './db.config.js';
import swaggerDocumentOne from '../swagger/openapi.json' assert {type: 'json'};
import swaggerDocumentTwo from '../swagger/swagger.json' assert {type: 'json'};
import {BaseError} from './errors.js';
import swaggerDocument from '../swagger/openapi.json' assert {type: 'json'};
import {sessionAuthMiddleware} from './auth.config.js';
import cookieParser from 'cookie-parser';
import {ValidateError} from 'tsoa';

// routers
import {memoFolderRouter} from './routers/memo.router.js';
import {RegisterRoutes} from './routers/tsoaRoutes.js';
import {challengeRouter} from './routers/challenge.router.js';
import {authRouter} from './routers/auth.routers.js';
import {userRouter} from './routers/user.router.js';
import {tagRouter} from './routers/tag.router.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware for basic configurations
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Swagger Docs
app.use(
  '/docs/v1',
  swaggerUiExpress.serveFiles(swaggerDocumentOne),
  swaggerUiExpress.setup(swaggerDocumentOne),
);

app.use(
  '/docs/v2',
  swaggerUiExpress.serveFiles(swaggerDocumentTwo),
  swaggerUiExpress.setup(swaggerDocumentTwo),
);

// Response customization middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = (success: any) => {
    return res.json({resultType: 'SUCCESS', error: null, success});
  };

  res.error = (error: {errorCode?: string; reason?: string; data?: any}) => {
    const {errorCode = 'unknown', reason = null, data = null} = error;
    return res.status(400).json({
      resultType: 'FAIL',
      error: {errorCode, reason, data},
      success: null,
    });
  };

  next();
});

// Session setup
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      serializer: {
        stringify: (obj: unknown) =>
          JSON.stringify(obj, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          ),
        parse: (str: string) =>
          JSON.parse(str, (_, value) =>
            typeof value === 'string' && /^\d+$/.test(value)
              ? BigInt(value)
              : value,
          ),
      },
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// // 로그인 전
// app.use('/oauth2', authRouter);

// // 인증 미들웨어
// app.use(sessionAuthMiddleware);

// 로그인 후
app.use('/onboarding', userRouter);
app.use('/memo', memoFolderRouter);
app.use('/challenge', challengeRouter);
app.use('/tag', tagRouter);
RegisterRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Sweepic');
});
// Error handling middleware (수정된 부분)
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      resultType: 'FAIL',
      error: {
        errorCode: err.code,
        reason: err.message,
        data: err.details,
      },
      success: null,
    });
    return;
  }

  if (err instanceof ValidateError) {
    res.status(err.status).json({
      resultType: 'FAIL',
      error: {
        errorCode: 'VAL-001',
        reason: 'Validation Error',
        data: err.fields,
      },
      success: null,
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    resultType: 'FAIL',
    error: {
      errorCode: 'unknown',
      reason: err.message || 'Unknown error occurred',
      data: null,
    },
    success: null,
  });
};

app.use(errorHandler);
// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
