import { Test, TestingModule } from '@nestjs/testing';
import { AlternativeController } from './alternative.controller';

describe('AlternativeController', () => {
  let controller: AlternativeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlternativeController],
    }).compile();

    controller = module.get<AlternativeController>(AlternativeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
