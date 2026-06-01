import { prisma } from "../../config/prisma.ts";
import { AppError } from "../../errors/app-error.ts";
import { hashPassword, signAuthToken, verifyPassword } from "../../lib/auth.ts";

type SignupInput = {
  email: string;
  password: string;
  organizationName: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const normalizeEmail = (email: string) => email.toLowerCase();

export const signup = async ({ email, password, organizationName }: SignupInput) => {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new AppError("Email is already in use", 409, "CONFLICT");
  }

  const passwordHash = await hashPassword(password);

  const createdOrganization = await prisma.organization.create({
    data: {
      name: organizationName,
      user: {
        create: {
          email: normalizedEmail,
          passwordHash,
        },
      },
      settings: {
        create: {},
      },
    },
    include: {
      user: true,
      settings: true,
    },
  });

  if (!createdOrganization.user) {
    throw new AppError("Failed to create account", 500, "INTERNAL_ERROR");
  }

  const token = signAuthToken({
    userId: createdOrganization.user.id,
    organizationId: createdOrganization.id,
    email: createdOrganization.user.email,
  });

  return {
    token,
    user: {
      id: createdOrganization.user.id,
      email: createdOrganization.user.email,
    },
    organization: {
      id: createdOrganization.id,
      name: createdOrganization.name,
    },
  };
};

export const login = async ({ email, password }: LoginInput) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
    },
    include: {
      organization: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
  }

  const token = signAuthToken({
    userId: user.id,
    organizationId: user.organizationId,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
    organization: {
      id: user.organization.id,
      name: user.organization.name,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      organization: true,
    },
  });

  if (!user) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    organization: {
      id: user.organization.id,
      name: user.organization.name,
    },
  };
};
