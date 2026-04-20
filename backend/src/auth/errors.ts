export {
    UserNotExistsException,
    UserAlreadySignedException,
    WrongPasswordException,
    InvalidSignUpProviderException,
}

class UserNotExistsException extends Error {}
class UserAlreadySignedException extends Error {}
class WrongPasswordException extends Error {}
class InvalidSignUpProviderException extends Error {}