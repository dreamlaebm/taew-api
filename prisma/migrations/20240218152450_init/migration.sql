-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "accessToken" CHAR(64) NOT NULL,
    "username" VARCHAR(28) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "displayName" VARCHAR(32),
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_accessToken_key" ON "User"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
