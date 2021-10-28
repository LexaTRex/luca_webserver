import { Sequelize, Model, ModelCtor, DataTypes } from 'sequelize';
import { promisify } from 'util';
import crypto from 'crypto';
import config from 'config';

const scrypt = promisify(crypto.scrypt);

interface Attributes {
  name: string;
  password: string;
  salt: string;
}

type CreationAttributes = Attributes;

export interface internalAccessUserInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  checkPassword: (testPassword: string) => Promise<boolean>;
}

export const initInternalAccessUser = (
  sequelize: Sequelize
): ModelCtor<internalAccessUserInstance> => {
  const model = sequelize.define<internalAccessUserInstance>(
    'InternalAccessUser',
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(255),
      },
      salt: {
        type: DataTypes.STRING(255),
      },
    }
  );

  model.prototype.checkPassword = async function checkPassword(
    testPassword: string
  ) {
    const hash = (await scrypt(
      testPassword,
      this.get('salt'),
      config.get('keys.internalAccess.keyLength')
    )) as Buffer;
    return hash.toString('base64') === this.get('password');
  };

  return model;
};
