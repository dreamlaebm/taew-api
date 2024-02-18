import { Module } from '@nestjs/common';
import { PrismaService } from './provider/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'CHANGE ME',
      signOptions: {
        expiresIn: '32d',
      },
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService, JwtModule],
})
export class CommonModule {}
