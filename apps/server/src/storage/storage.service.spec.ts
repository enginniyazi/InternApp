import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { BadRequestException } from '@nestjs/common';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('servis tanımlı olmalıdır', () => {
    expect(service).toBeDefined();
  });

  it('dosya yoksa BadRequestException fırlatmalıdır', async () => {
    await expect(
      service.saveCv(null as unknown as Express.Multer.File),
    ).rejects.toThrow(BadRequestException);
  });

  it('PDF dışındaki formatlarda BadRequestException fırlatmalıdır', async () => {
    const mockFile = {
      mimetype: 'image/png',
      size: 1024,
      originalname: 'test.png',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    await expect(service.saveCv(mockFile)).rejects.toThrow(BadRequestException);
  });

  it('5MB üzeri dosyalarda BadRequestException fırlatmalıdır', async () => {
    const mockFile = {
      mimetype: 'application/pdf',
      size: 6 * 1024 * 1024,
      originalname: 'large.pdf',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    await expect(service.saveCv(mockFile)).rejects.toThrow(BadRequestException);
  });
});
