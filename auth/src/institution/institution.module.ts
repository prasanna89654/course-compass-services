import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionResolver } from './institution.resolver';
import { PrismaModule } from '../../src/prisma/prisma.module';

@Module({
  providers: [InstitutionResolver, InstitutionService],
  imports: [PrismaModule],
})
export class InstitutionModule {}
