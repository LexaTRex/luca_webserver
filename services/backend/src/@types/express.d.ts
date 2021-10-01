interface IUser {
  uuid: string;
}

interface IOperator extends IUser {
  type: 'Operator';
  allowOperatorDevices: boolean;
}

interface IOperatorDevice extends IOperator {
  type: 'OperatorDevice';
  device: {
    uuid: string;
    name: string;
    os: 'android' | 'ios';
    role: 'scanner' | 'employee' | 'manager';
  };
}

interface IHealthDepartmentEmployee extends IUser {
  isAdmin: boolean;
  departmentId: string;
  HealthDepartment: unknown;
  type: 'HealthDepartmentEmployeee';
}

declare namespace Express {
  export interface Request {
    user?: IUser | IOperator | IOperatorDevice | IHealthDepartmentEmployee;
  }
}
