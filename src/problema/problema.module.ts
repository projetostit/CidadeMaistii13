import { Module } from '@nestjs/common';
import { ProblemaController } from './problema.controller';
import { ProblemaService } from './problema.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProblemaController],
  providers: [ProblemaService],
})
export class ProblemaModule {}