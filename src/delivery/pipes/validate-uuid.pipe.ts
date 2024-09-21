import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { isUUID } from "class-validator";

@Injectable()
export class ValidateUUIDPipe implements PipeTransform {
  transform(value: any) {
    if (!isUUID(value)) {
      throw new BadRequestException("UserId is not a valid UUID");
    }
    return value;
  }
}
