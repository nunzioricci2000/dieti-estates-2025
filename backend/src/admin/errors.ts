export {
    AdminAlreadySignedException,
    AgentAlreadySignedException,
    InvalidConfigurationError,
    AdminNotExistsException,
    AgentNotExistsException,
};

class AdminAlreadySignedException extends Error {}
class AgentAlreadySignedException extends Error {}
class InvalidConfigurationError extends Error {}
class AdminNotExistsException extends Error {}
class AgentNotExistsException extends Error {}
