import { NestFactory } from "@nestjs/core";
import { DeliveryModule } from "./delivery/delivery.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(DeliveryModule);

  app.enableCors({
    origin: 'http://localhost:5173',  
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
