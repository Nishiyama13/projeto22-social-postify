import { HttpException, HttpStatus } from '@nestjs/common';

export class PostOrMediaForbiddenException extends HttpException {
  private _id: number;
  private _action: string;
  constructor(id: number, action: string) {
    super(
      `This ${action} Id ${id} is linked to a publication`,
      HttpStatus.FORBIDDEN,
    );
    this._id = id;
    this._action = action;
  }

  get id() {
    return this._id;
  }

  get action() {
    return this._action;
  }
}
