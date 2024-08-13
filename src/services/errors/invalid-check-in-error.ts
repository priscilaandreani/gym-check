export class InvalidCheckInError extends Error {
  constructor(message?: string) {
    super(`Invalid check-in. ${message}`);
  }
}
