/*
  Warnings:

  - You are about to drop the column `purpose` on the `otp_codes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `otp_codes` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `credentials` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `session_id` to the `otp_codes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_user_id_fkey";

-- DropForeignKey
ALTER TABLE "otp_codes" DROP CONSTRAINT "otp_codes_user_id_fkey";

-- DropIndex
DROP INDEX "otp_codes_user_id_purpose_created_at_idx";

-- AlterTable
ALTER TABLE "otp_codes" DROP COLUMN "purpose",
DROP COLUMN "user_id",
ADD COLUMN     "session_id" UUID NOT NULL,
ALTER COLUMN "code_hash" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verified",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password_hash" VARCHAR(255);

-- DropTable
DROP TABLE "credentials";

-- CreateTable
CREATE TABLE "sign_in_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "consumed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sign_in_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sign_in_sessions_user_id_created_at_idx" ON "sign_in_sessions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "sign_in_sessions_expires_at_idx" ON "sign_in_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "otp_codes_session_id_idx" ON "otp_codes"("session_id");

-- AddForeignKey
ALTER TABLE "sign_in_sessions" ADD CONSTRAINT "sign_in_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sign_in_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
