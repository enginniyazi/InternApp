import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST') || 'localhost';
    const port = this.configService.get<number>('SMTP_PORT') || 1025;
    const user = this.configService.get<string>('SMTP_USER') || '';
    const pass = this.configService.get<string>('SMTP_PASS') || '';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user ? { user, pass } : undefined,
    });
  }

  async sendNewApplicationNotification(
    companyEmail: string,
    studentName: string,
    internshipTitle: string,
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f6f8;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Yeni Staj Başvurusu! 🚀</h2>
          <p>Sayın Şirket Yetkilisi,</p>
          <p><strong>${studentName}</strong> isimli aday, <strong>${internshipTitle}</strong> ilanınıza başvurdu.</p>
          <p>Detayları incelemek için platformumuza giriş yapabilirsiniz.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">StajApp Platformu Otomatik Bildirim Sistemi</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"StajApp Notification" <no-reply@stajapp.com>',
        to: companyEmail,
        subject: `Yeni Başvuru: ${internshipTitle}`,
        html,
      });
      this.logger.log(`E-posta başarıyla gönderildi: ${companyEmail}`);
    } catch (err) {
      this.logger.warn(
        `E-posta gönderimi simüle edildi veya başarısız: ${err}`,
      );
    }
  }

  async sendStatusUpdateNotification(
    studentEmail: string,
    internshipTitle: string,
    status: string,
  ) {
    const statusLabels: Record<string, string> = {
      ACCEPTED: 'Kabul Edildi 🎉',
      REJECTED: 'Reddedildi 😔',
      REVIEWING: 'İncelemeye Alındı 🔍',
    };

    const statusLabel = statusLabels[status] || status;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f6f8;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Başvuru Durumunuz Güncellendi</h2>
          <p>Merhaba,</p>
          <p><strong>${internshipTitle}</strong> ilanına yaptığınız başvurunun durumu: <strong>${statusLabel}</strong> olarak güncellenmiştir.</p>
          <p>Detaylar için hesabınıza giriş yapabilirsiniz.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">StajApp Platformu Bildirim Servisi</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"StajApp Notification" <no-reply@stajapp.com>',
        to: studentEmail,
        subject: `Başvuru Durumu: ${internshipTitle}`,
        html,
      });
      this.logger.log(`E-posta başarıyla gönderildi: ${studentEmail}`);
    } catch (err) {
      this.logger.warn(
        `E-posta gönderimi simüle edildi veya başarısız: ${err}`,
      );
    }
  }
}
