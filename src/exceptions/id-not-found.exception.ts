import { HttpException, HttpStatus } from '@nestjs/common';

export class IdNotFoundException extends HttpException {
  private _id: number;
  constructor(id: number) {
    super(`Id ${id} not found`, HttpStatus.NOT_FOUND);
    this._id = id;
  }

  get id() {
    return this._id;
  }
}
