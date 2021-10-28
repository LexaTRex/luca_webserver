import { promisify } from 'util';
import crypto from 'crypto';
import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';
import { UserType } from 'constants/user';
import type { LocationInstance } from './location';
import type { Models } from '..';

interface Attributes {
  uuid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  salt: string;
  activated: boolean;
  supportCode: string;
  lastVersionSeen: string;
  isTrusted: boolean;
  allowOperatorDevices: boolean;
  publicKey?: string;
  privateKeySecret?: string;
  avvAccepted?: boolean;
}

interface CreationAttributes {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  salt: string;
  supportCode: string;
  lastVersionSeen?: string;
  isTrusted?: boolean;
  publicKey?: string;
  privateKeySecret?: string;
  avvAccepted?: boolean;
}

export interface OperatorInstance
  extends Model<Attributes, CreationAttributes>,
    Attributes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  checkPassword: (testPassword: string) => Promise<boolean>;

  Locations?: Array<LocationInstance>;
}

const scrypt = promisify(crypto.scrypt);

const KEY_LENGTH = 64;

const hashPasswordHook = async (instance: OperatorInstance) => {
  if (!instance.changed('password')) return;
  const password = instance.get('password');
  const salt = instance.get('salt');
  const hash = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  await instance.set('password', hash.toString('base64'));
};

const destroySessionsHook = async (instance: OperatorInstance) => {
  if (!(instance.changed('password') || instance.changed('email'))) return;
  await instance.sequelize.models.Session.destroy({
    where: {
      userId: instance.get('uuid'),
      type: UserType.OPERATOR,
    },
  });
};

export const initOperators = (
  sequelize: Sequelize
): ModelCtor<OperatorInstance> => {
  const model = sequelize.define<OperatorInstance>(
    'Operator',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set() {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: false,
      },
      username: {
        type: DataTypes.CITEXT,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicKey: {
        type: DataTypes.STRING(88),
      },
      activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      privateKeySecret: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING(44),
      },
      supportCode: {
        allowNull: false,
        type: DataTypes.STRING(12),
      },
      avvAccepted: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      lastVersionSeen: {
        allowNull: false,
        defaultValue: '1.0.0',
        type: DataTypes.STRING(32),
      },
      allowOperatorDevices: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      isTrusted: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      paranoid: true,
      hooks: {
        beforeCreate: hashPasswordHook,
        beforeUpdate: hashPasswordHook,
        afterUpdate: destroySessionsHook,
      },
    }
  );

  model.prototype.checkPassword = async function checkPassword(
    testPassword: string
  ) {
    const hash = (await scrypt(
      testPassword,
      this.get('salt'),
      KEY_LENGTH
    )) as Buffer;
    return hash.toString('base64') === this.get('password');
  };

  return model;
};

export const associateOperator = (models: Models): void => {
  models.Operator.hasMany(models.Location, {
    foreignKey: 'operator',
    onDelete: 'CASCADE',
  });
};
