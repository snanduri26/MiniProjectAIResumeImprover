-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "improved" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);
