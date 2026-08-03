import { PrismaClient, Role, ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Admin Kullanıcısı
  await prisma.user.upsert({
    where: { email: 'admin@stajapp.com' },
    update: {},
    create: {
      email: 'admin@stajapp.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // 2. Şirket 1: TechVision A.Ş.
  const techVisionUser = await prisma.user.upsert({
    where: { email: 'hr@techvision.com' },
    update: {},
    create: {
      email: 'hr@techvision.com',
      passwordHash,
      role: Role.COMPANY,
      companyProfile: {
        create: {
          companyName: 'TechVision A.Ş.',
          website: 'https://techvision.com',
          description: 'Yenilikçi yapay zekâ ve web yazılım çözümleri.',
          isApproved: true,
        },
      },
    },
    include: { companyProfile: true },
  });

  // 3. Şirket 2: DataCorp Yazılım
  const dataCorpUser = await prisma.user.upsert({
    where: { email: 'kariyer@datacorp.com' },
    update: {},
    create: {
      email: 'kariyer@datacorp.com',
      passwordHash,
      role: Role.COMPANY,
      companyProfile: {
        create: {
          companyName: 'DataCorp Yazılım',
          website: 'https://datacorp.com',
          description:
            'Büyük veri ve bulut teknolojileri üzerine uzman şirket.',
          isApproved: true,
        },
      },
    },
    include: { companyProfile: true },
  });

  // 4. Öğrenci 1: Ahmet Yılmaz
  const studentAhmet = await prisma.user.upsert({
    where: { email: 'ahmet@ogrenci.edu.tr' },
    update: {},
    create: {
      email: 'ahmet@ogrenci.edu.tr',
      passwordHash,
      role: Role.STUDENT,
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

  // 5. Örnek İlanlar
  if (techVisionUser.companyProfile) {
    const internship1 = await prisma.internship.create({
      data: {
        companyId: techVisionUser.companyProfile.id,
        title: 'Frontend Developer Stajyeri',
        description:
          'React, TypeScript ve modern CSS geliştirmelerinde aktif rol alacak stajyer arıyoruz.',
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
          status: ApplicationStatus.REVIEWING,
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
        description:
          'Clean Architecture ve PostgreSQL altyapılı NestJS mikroservis projelerimizde staj imkânı.',
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
