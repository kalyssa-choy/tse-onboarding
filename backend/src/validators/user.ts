import { body } from "express-validator";

// more info about validators:
// https://express-validator.github.io/docs/guides/validation-chain
// https://github.com/validatorjs/validator.js#validators

const makeNameValidator = () =>
  body("name")
    // name must exist, if not this message will be displayed
    .exists()
    .withMessage("name is required")
    // bail prevents the remainder of the validation chain for this field from being executed if
    // there was an error
    .bail()
    .isString()
    .withMessage("name must be a string")
    .bail()
    .notEmpty()
    .withMessage("name cannot be empty");
const makeProfilePictureURLValidator = () =>
  body("profilePictureURL")
    // order matters for the validation chain - by marking this field as optional, the rest of
    // the chain will only be evaluated if it exists
    .optional()
    .isString()
    .withMessage("profilePictureURL must be a string");

// establishes a set of rules that the body of the task creation route must follow
export const createUser = [makeNameValidator(), makeProfilePictureURLValidator()];
