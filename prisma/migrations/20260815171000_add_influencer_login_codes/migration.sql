CREATE TABLE "InfluencerLoginCode" (
  "id" TEXT NOT NULL,
  "influencerId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "InfluencerLoginCode_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InfluencerLoginCode_email_createdAt_idx" ON "InfluencerLoginCode"("email", "createdAt");
CREATE INDEX "InfluencerLoginCode_influencerId_createdAt_idx" ON "InfluencerLoginCode"("influencerId", "createdAt");

ALTER TABLE "InfluencerLoginCode"
  ADD CONSTRAINT "InfluencerLoginCode_influencerId_fkey"
  FOREIGN KEY ("influencerId") REFERENCES "InfluencerProfile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
