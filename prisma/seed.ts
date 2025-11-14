import prisma from '../src/config/database';
import { hashPassword } from '../src/utils/bcrypt';

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thh.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@thh.com',
      password: adminPassword,
      fullName: 'ผู้ดูแลระบบ',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Staff User
  const staffPassword = await hashPassword('staff123');
  const staff = await prisma.user.upsert({
    where: { email: 'staff@thh.com' },
    update: {},
    create: {
      username: 'staff',
      email: 'staff@thh.com',
      password: staffPassword,
      fullName: 'เจ้าหน้าที่',
      role: 'STAFF',
      hospital: 'ศูนย์บริหารการพัฒนาสุขภาพจังหวัดชายแดนภาคใต้',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Staff user created:', staff.email);

  // Create Executive User
  const execPassword = await hashPassword('exec123');
  const executive = await prisma.user.upsert({
    where: { email: 'executive@thh.com' },
    update: {},
    create: {
      username: 'executive',
      email: 'executive@thh.com',
      password: execPassword,
      fullName: 'ผู้บริหาร',
      role: 'EXECUTIVE',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Executive user created:', executive.email);

  // Create Doctor Users
  const doctorPassword = await hashPassword('doctor123');
  
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.somchai@thh.com' },
    update: {},
    create: {
      username: 'dr.somchai',
      email: 'dr.somchai@thh.com',
      password: doctorPassword,
      fullName: 'นพ.สมชาย ใจดี',
      role: 'DOCTOR',
      hospital: 'โรงพยาบาลปัตตานี',
      phoneNumber: '073-123456',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Doctor 1 created:', doctor1.email);

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.wanida@thh.com' },
    update: {},
    create: {
      username: 'dr.wanida',
      email: 'dr.wanida@thh.com',
      password: doctorPassword,
      fullName: 'พญ.วนิดา สุขสันต์',
      role: 'DOCTOR',
      hospital: 'โรงพยาบาลยะลา',
      phoneNumber: '073-234567',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Doctor 2 created:', doctor2.email);

  const doctor3 = await prisma.user.upsert({
    where: { email: 'dr.anucha@thh.com' },
    update: {},
    create: {
      username: 'dr.anucha',
      email: 'dr.anucha@thh.com',
      password: doctorPassword,
      fullName: 'นพ.อนุชา รักษา',
      role: 'DOCTOR',
      hospital: 'โรงพยาบาลนราธิวาส',
      phoneNumber: '073-345678',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Doctor 3 created:', doctor3.email);

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Default users:');
  console.log('Admin: admin@thh.com / admin123');
  console.log('Staff: staff@thh.com / staff123');
  console.log('Executive: executive@thh.com / exec123');
  console.log('Doctor 1: dr.somchai@thh.com / doctor123 (รพ.ปัตตานี)');
  console.log('Doctor 2: dr.wanida@thh.com / doctor123 (รพ.ยะลา)');
  console.log('Doctor 3: dr.anucha@thh.com / doctor123 (รพ.นราธิวาส)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
