-- CreateTable
CREATE TABLE "DonationEntry" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amount1" DOUBLE PRECISION NOT NULL,
    "amount2" DOUBLE PRECISION NOT NULL,
    "amount3" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DonationEntry_pkey" PRIMARY KEY ("id")
);
