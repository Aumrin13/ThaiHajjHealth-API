declare module 'swagger-jsdoc' {
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

  function swaggerJsdoc(options: Options): any;

  export = swaggerJsdoc;
}
