import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('controller tanımlı olmalıdır', () => {
    expect(controller).toBeDefined();
  });

  it('status: ok ve zaman damgası dönmelidir', () => {
    const res = controller.check();
    expect(res.status).toBe('ok');
    expect(res.timestamp).toBeDefined();
    expect(typeof res.uptime).toBe('number');
  });
});
