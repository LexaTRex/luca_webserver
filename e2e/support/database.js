const DB_PROPERTIES = Cypress.config('db');
export const CONNECTION_STRING = {
  user: DB_PROPERTIES.user,
  password: DB_PROPERTIES.password,
  host: DB_PROPERTIES.host,
  database: DB_PROPERTIES.database,
  port: DB_PROPERTIES.port,
};
