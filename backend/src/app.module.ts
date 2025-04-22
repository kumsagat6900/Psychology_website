import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, TestModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
