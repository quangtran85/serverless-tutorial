import { AppException } from '@shared/libs/exception';
import * as mongoose from 'mongoose';
import Container from 'typedi';

export async function connectDb(
  uri: string,
  options?: mongoose.ConnectOptions,
) {
  try {
    if (
      !Container.has('dbConnection') ||
      Container.get<mongoose.Connection>('dbConnection').readyState === 0
    ) {
      const mongo = await mongoose.connect(
        uri,
        options ?? {
          autoIndex: false, // Don't build indexes
          maxPoolSize: 10, // Maintain up to 10 socket connections
          serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
          socketTimeoutMS: 6000, // Close sockets after 45 seconds of inactivity
          family: 4, // Use IPv4, skip trying IPv6
          connectTimeoutMS: 6000,
        },
      );

      if (mongo.connection.readyState !== 1) {
        throw new Error('Db Connection has failed!');
      }
      Container.set('dbConnection', mongo.connection);
      console.log('Db Connect Successfull!');
    }
  } catch (error) {
    console.log(error);
    throw new AppException('DBError', 'Internal Server Error', 500);
  }
}
