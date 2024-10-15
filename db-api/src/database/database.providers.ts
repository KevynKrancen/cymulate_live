import * as mongoose from 'mongoose';

export const Database = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(process.env.DB_URL),
  }
];
