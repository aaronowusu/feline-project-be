import { ValidateUUIDPipe } from "./validate-uuid.pipe";
import { BadRequestException } from "@nestjs/common";

describe("ValidateUUIDPipe", () => {
  let pipe: ValidateUUIDPipe;

  beforeEach(() => {
    pipe = new ValidateUUIDPipe();
  });

  it("should pass through a valid UUID", () => {
    const validUUID = "9e3f04bb-d485-4dab-a08b-a6c356f30a03";
    expect(pipe.transform(validUUID)).toBe(validUUID);
  });

  it("should throw a BadRequestException for an invalid UUID", () => {
    const invalidUUID = "invalid-uuid";
    const invalidUUIDNumber = 123456;

    // Call the pipe's transform method with an invalid UUID that is a string
    expect(() => pipe.transform(invalidUUID)).toThrow(BadRequestException);
    expect(() => pipe.transform(invalidUUID)).toThrow(
      "UserId is not a valid UUID",
    );

    // Call the pipe's transform method with an invalid UUID that is not a string
    expect(() => pipe.transform(invalidUUIDNumber)).toThrow(
      BadRequestException,
    );
    expect(() => pipe.transform(invalidUUIDNumber)).toThrow(
      "UserId is not a valid UUID",
    );
  });
});
