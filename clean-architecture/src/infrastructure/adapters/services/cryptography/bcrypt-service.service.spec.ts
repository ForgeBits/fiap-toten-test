import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt-service.service';

describe('BcryptServiceService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
