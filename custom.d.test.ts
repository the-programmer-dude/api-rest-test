import { Request } from "express";

// interface userInterface {
//   id: number;
//   user: {
//     id: number;
//     role: string;
//     deleted: boolean;
//     deletedByAdmin: boolean;
//     name: string;
//     username: string;
//     email: string;
//     password: string;
//     passwordRecuperation: any;
//     passwordExpiresIn: any;
//   };
// }

export default interface IRequest extends Request {
  user?: any;
}
