interface IUser {
  uuid: string;
}

interface IOperator extends IUser {
  type: 'Operator';
}

interface IHealthDepartmentEmployee extends IUser {
  HealthDepartment: unknown;
  departmentId: string;
  isAdmin: boolean;
  type: 'HealthDepartmentEmployeee';
}

declare namespace Express {
  export interface Request {
    user?: IUser | IOperator | IHealthDepartmentEmployee;
  }
}
