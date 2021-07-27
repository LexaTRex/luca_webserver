declare namespace Express {
  export interface Request {
    user?: {
      // for now just as a basic check until the models are correctly types
      uuid: string;
    };
  }
}
