import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { UploadModule } from './upload/upload.module';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/dealdrop'),
    AuthModule,
    UsersModule,
    ItemsModule,
    UploadModule,
  ],
})
export class AppModule {}