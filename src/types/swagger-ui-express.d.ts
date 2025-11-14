declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';

  interface SwaggerUiOptions {
    explorer?: boolean;
    customCss?: string;
    customSiteTitle?: string;
    customfavIcon?: string;
    swaggerOptions?: any;
    customCssUrl?: string;
    customJs?: string;
  }

  export function setup(
    swaggerDoc: any,
    options?: SwaggerUiOptions,
    customCss?: string,
    customfavIcon?: string,
    swaggerUrl?: string,
    customSiteTitle?: string
  ): RequestHandler;

  export const serve: RequestHandler[];

  export function generateHTML(
    swaggerDoc: any,
    options?: SwaggerUiOptions
  ): string;
}
