-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "needPasswordChanged" SET DEFAULT true,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
