import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { EncryptionServiceInterface } from 'src/core/application/ports/output/services/encryption/encryption.service.interface';

@Injectable()
export class BcryptService implements EncryptionServiceInterface {
  constructor(private readonly configService: ConfigService) {}

  async hash(data: string): Promise<string> {
    const saltRounds = this.configService.get<number>('bcryptSaltRounds') ?? 10;
    return await bcrypt.hash(data, saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
