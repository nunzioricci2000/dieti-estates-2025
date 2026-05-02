export {
    UserNotExistsException,
    UserAlreadySignedException,
    WrongPasswordException,
    InvalidSignUpProviderException,
    InsufficientDataException,
};

class UserNotExistsException extends Error {}
class UserAlreadySignedException extends Error {}
class WrongPasswordException extends Error {}
class InvalidSignUpProviderException extends Error {}
class InsufficientDataException extends Error {}
