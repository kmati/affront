export class InvalidArgumentError extends Error {
	constructor(message, argument) {
		super(message);
		this.message = message;
		this.argument = argument;
		this.name = 'InvalidArgumentError';
	}
};