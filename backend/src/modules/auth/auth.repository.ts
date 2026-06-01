import { prisma } from '../../config/prisma';

export const authRepository = {
  findUserByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findUserById: (id: string) => prisma.user.findUnique({ where: { id } }),
  createUser: (email: string, hashedPassword: string, fullName?: string) =>
    prisma.user.create({
      data: { email, password: hashedPassword, fullName },
    }),
};
