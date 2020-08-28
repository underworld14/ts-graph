import { InputType, Field } from "type-graphql";
import {
  Length,
  IsEmail,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { User } from "../../entity/User";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    return User.findOne({ where: { email } }).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}

@InputType()
export class registerInput {
  @Field()
  @Length(1, 255)
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already exists !" })
  email: string;

  @Field()
  @Length(4, 16)
  username: string;

  @Field()
  password: string;
}

@InputType()
export class loginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
