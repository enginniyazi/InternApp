import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'cvs');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveCv(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Lütfen bir CV dosyası seçiniz.');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'Sadece PDF formatındaki dosyalar kabul edilmektedir.',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('Dosya boyutu en fazla 5MB olabilir.');
    }

    const fileExtension = path.extname(file.originalname) || '.pdf';
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return `/uploads/cvs/${fileName}`;
  }
}
