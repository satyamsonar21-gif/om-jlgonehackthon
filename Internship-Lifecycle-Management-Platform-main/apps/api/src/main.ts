import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse HTTP Cookies securely
  app.use(cookieParser());

  // ─── CSRF & ORIGIN INTEGRITY MIDDLEWARE ─────────────────────────────────────
  // Validates Origin / Referer against trusted frontend hosts on mutating requests
  const isProd = process.env.NODE_ENV === 'production';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const allowedOrigins = [
    appUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
  ];

  app.use((req: any, res: any, next: any) => {
    const isMutatingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const origin = req.headers['origin'] || req.headers['referer'];
    const hasSessionCookie = req.cookies && req.cookies['ilmp_session'];

    // If request carries cookie session and is mutating, verify Origin/Referer in production
    if (isProd && isMutatingMethod && hasSessionCookie && origin) {
      const isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));
      if (!isAllowed) {
        return res.status(403).json({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Cross-Site Request Forgery (CSRF) validation failed. Untrusted origin.',
        });
      }
    }
    next();
  });

  // ─── CORS SECURITY HARDENING ────────────────────────────────────────────────
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some(
        (allowed) => origin === allowed || (allowed.endsWith('/') && origin === allowed.slice(0, -1)),
      );

      if (isAllowed || !isProd) {
        return callback(null, true);
      }

      return callback(new Error('Cross-Origin Request Blocked by ILMP Security Policy'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-csrf-token'],
  });

  // ─── STRICT INPUT VALIDATION PIPE ───────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true, // Reject unexpected payloads with 400 Bad Request
      forbidUnknownValues: true,
    }),
  );

  // ─── SWAGGER API SPECIFICATION ──────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('ILMP API')
    .setDescription('Internship Lifecycle Management Platform API - Enterprise Security Edition')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('ilmp_session')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 ILMP API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
