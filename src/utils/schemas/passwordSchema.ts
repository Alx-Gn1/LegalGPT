import PasswordValidator from "password-validator";

const schema = new PasswordValidator();

schema
  .is()
  .min(8, "Le mot de passe doit faire 8 caractères minimum") // Minimum length 8
  .is()
  .max(100, "Le mot de passe ne peut pas dépasser les 100 caractères") // Maximum length 100
  .has()
  .uppercase(1, "Le mot de passe doit contenir une majuscule") // Must have uppercase letters
  .has()
  .lowercase(1, "Le mot de passe doit contenir une minuscule") // Must have lowercase letters
  .has()
  .digits(1, "Le mot de passe doit contenir un nombre") // Must have at least 1 digit
  .has()
  .symbols(1, "Le mot de passe doit contenir un caractère spécial (@$!%*?&)") // Must have at least 1 symbol
  .has()
  .not()
  .spaces(); // Should not have spaces

export default function validatePassword(password: string) {
  return schema.validate(password, { details: true }) as PasswordValidatorErrorMessage[];
}

export interface PasswordValidatorErrorMessage {
  validation: string;
  arguments: number;
  message: string;
}
