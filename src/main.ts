import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Your API Title") // Title for your API documentation
    .setDescription("API description for your application") // Description
    .setVersion("1.0") // Version of your API
    .addBearerAuth() // If you are using JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document); // Swagger UI will be available at /api-docs

  await app.listen(3000);
}

bootstrap();