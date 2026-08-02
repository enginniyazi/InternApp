import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('servis tanımlı olmalıdır', () => {
    expect(service).toBeDefined();
  });

  it('yeni başvuru bildirim e-postası hata vermeden çalışmalıdır', async () => {
    await expect(
      service.sendNewApplicationNotification(
        'company@example.com',
        'Ali Yılmaz',
        'Frontend Stajyeri',
      ),
    ).resolves.not.toThrow();
  });
});
