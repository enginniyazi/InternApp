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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash('123456', 10);
    await prisma.user.upsert({
        where: { email: 'admin@stajapp.com' },
        update: {},
        create: {
            email: 'admin@stajapp.com',
            passwordHash,
            role: client_1.Role.ADMIN,
        },
    });
    const techVisionUser = await prisma.user.upsert({
        where: { email: 'hr@techvision.com' },
        update: {},
        create: {
            email: 'hr@techvision.com',
            passwordHash,
            role: client_1.Role.COMPANY,
            companyProfile: {
                create: {
                    companyName: 'TechVision A.Ş.',
                    website: 'https://techvision.com',
                    description: 'Yenilikçi yapay zekâ ve web yazılım çözümleri.',
                },
            },
        },
        include: { companyProfile: true },
    });
    const dataCorpUser = await prisma.user.upsert({
        where: { email: 'kariyer@datacorp.com' },
        update: {},
        create: {
            email: 'kariyer@datacorp.com',
            passwordHash,
            role: client_1.Role.COMPANY,
            companyProfile: {
                create: {
                    companyName: 'DataCorp Yazılım',
                    website: 'https://datacorp.com',
                    description: 'Büyük veri ve bulut teknolojileri üzerine uzman şirket.',
                },
            },
        },
        include: { companyProfile: true },
    });
    const studentAhmet = await prisma.user.upsert({
        where: { email: 'ahmet@ogrenci.edu.tr' },
        update: {},
        create: {
            email: 'ahmet@ogrenci.edu.tr',
            passwordHash,
            role: client_1.Role.STUDENT,
            studentProfile: {
                create: {
                    firstName: 'Ahmet',
                    lastName: 'Yılmaz',
                    phone: '+90 555 123 4567',
                    bio: 'Bilgisayar mühendisliği 3. sınıf öğrencisiyim. React ve TypeScript geliştirmeyi seviyorum.',
                },
            },
        },
        include: { studentProfile: true },
    });
    if (techVisionUser.companyProfile) {
        const internship1 = await prisma.internship.create({
            data: {
                companyId: techVisionUser.companyProfile.id,
                title: 'Frontend Developer Stajyeri',
                description: 'React, TypeScript ve modern CSS geliştirmelerinde aktif rol alacak stajyer arıyoruz.',
                location: 'İstanbul',
                isRemote: true,
                requirements: ['React', 'TypeScript', 'CSS', 'Git'],
            },
        });
        if (studentAhmet.studentProfile) {
            await prisma.application.create({
                data: {
                    studentId: studentAhmet.studentProfile.id,
                    internshipId: internship1.id,
                    status: client_1.ApplicationStatus.REVIEWING,
                    note: 'Frontend geliştirmeye çok ilgiliyim.',
                },
            });
        }
    }
    if (dataCorpUser.companyProfile) {
        await prisma.internship.create({
            data: {
                companyId: dataCorpUser.companyProfile.id,
                title: 'Backend Developer Stajyeri (NestJS)',
                description: 'Clean Architecture ve PostgreSQL altyapılı NestJS mikroservis projelerimizde staj imkânı.',
                location: 'Ankara',
                isRemote: false,
                requirements: ['Node.js', 'NestJS', 'PostgreSQL', 'Prisma'],
            },
        });
    }
    console.log('✅ Veritabanı seed verileri başarıyla zenginleştirildi.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map