import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateDataException extends HttpException {
  private _title: string;
  private _username: string;

  constructor(title: string, username: string) {
    super(
      `This title: ${title}, has already been registered by ${username}`,
      HttpStatus.CONFLICT,
    );
    this._title = title;
    this._username = username;
  }

  get title() {
    return this._title;
  }

  get username() {
    return this._username;
  }
}
