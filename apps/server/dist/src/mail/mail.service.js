"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    configService;
    logger = new common_1.Logger(MailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        const host = this.configService.get('SMTP_HOST') || 'localhost';
        const port = this.configService.get('SMTP_PORT') || 1025;
        const user = this.configService.get('SMTP_USER') || '';
        const pass = this.configService.get('SMTP_PASS') || '';
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: user ? { user, pass } : undefined,
        });
    }
    async sendNewApplicationNotification(companyEmail, studentName, internshipTitle) {
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
        }
        catch (err) {
            this.logger.warn(`E-posta gönderimi simüle edildi veya başarısız: ${err}`);
        }
    }
    async sendStatusUpdateNotification(studentEmail, internshipTitle, status) {
        const statusLabels = {
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
        }
        catch (err) {
            this.logger.warn(`E-posta gönderimi simüle edildi veya başarısız: ${err}`);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map