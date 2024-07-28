import bcrypt from 'bcrypt';
import config from '../config';
import prisma from '.';

/**
 * Function to initialize the application with a super admin user.
 * Hashes the super admin password using bcrypt, creates or updates the super admin user,
 * and their associated profile using Prisma.
 * 
 * @returns {Promise<void>}
 */
(async function main() {
  try {
    // Hash the super admin password
    const hashedPassword = await bcrypt.hash(config.SUPER_ADMIN.PASS!, Number(config.BCRYPT_SALT_ROUNDS));

    // Use Prisma transaction to create or update super admin user and profile
    await prisma.$transaction(async (tx: any) => {
      const user = await tx.users.upsert({
        where: { email: config.SUPER_ADMIN.EMAIL! },
        update: {},
        create: {
          name: 'Super Admin',
          email: config.SUPER_ADMIN.EMAIL!,
          password: hashedPassword,
          role: "SUPER_ADMIN"
        }
      });

      const userProfile = await tx.adminProfiles.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          age: 26,
          bio: '',
          address: '',
          profileImage: 'https://i.pinimg.com/originals/34/f2/50/34f250635ed02218356595ea6d730518.jpg'
        }
      });

      return { user, userProfile };
    });

    // Disconnect Prisma client after successful initialization
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    // Disconnect Prisma client and exit process on error
    await prisma.$disconnect();
    process.exit(1);
  }
})();
