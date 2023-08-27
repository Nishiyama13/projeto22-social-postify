import { HttpException, HttpStatus } from '@nestjs/common';

export class ActionForbiddenException extends HttpException {
  private _id: number;
  constructor(id: number) {
    super(
      `This publication Id ${id} has already been published and cannot be changed`,
      HttpStatus.FORBIDDEN,
    );
    this._id = id;
  }

  get id() {
    return this._id;
  }
}
