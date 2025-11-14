declare module 'swagger-jsdoc' {
  namespace swaggerJsdoc {
    interface SwaggerDefinition {
      openapi?: string;
      info: {
        title: string;
        version: string;
        description?: string;
        contact?: {
          name?: string;
          email?: string;
          url?: string;
        };
        license?: {
          name: string;
          url?: string;
        };
      };
      servers?: Array<{
        url: string;
        description?: string;
      }>;
      components?: any;
      security?: any[];
      tags?: Array<{
        name: string;
        description?: string;
      }>;
    }

    interface Options {
      definition: SwaggerDefinition;
      apis: string[];
    }
  }

  function swaggerJsdoc(options: swaggerJsdoc.Options): any;

  export = swaggerJsdoc;
}
