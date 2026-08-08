import Database from "better-sqlite3"
import { mkdirSync } from "node:fs"
import { dirname, join } from "node:path"

const dbPath = join(process.cwd(), "prisma", "dev.db")

mkdirSync(dirname(dbPath), { recursive: true })

const db = new Database(dbPath)

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "InfluencerProfile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "city" TEXT,
  "primaryNetwork" TEXT NOT NULL,
  "socialHandle" TEXT NOT NULL,
  "audienceSize" INTEGER,
  "categories" TEXT NOT NULL,
  "languages" TEXT NOT NULL,
  "motivation" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "referralSlug" TEXT NOT NULL,
  "referralCode" TEXT NOT NULL,
  "availableCents" INTEGER NOT NULL DEFAULT 0,
  "pendingCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Campaign" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "rewardCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "startsAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endsAt" DATETIME,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "materialType" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ContentAsset" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ReferralEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "influencerId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "value" INTEGER NOT NULL DEFAULT 1,
  "source" TEXT,
  "metadata" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReferralEvent_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "InfluencerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Earning" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "influencerId" TEXT NOT NULL,
  "campaignId" TEXT,
  "amountCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "description" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Earning_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "InfluencerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Earning_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "InfluencerInvite" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "influencerId" TEXT NOT NULL,
  "inviteeName" TEXT NOT NULL,
  "inviteeEmail" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'INVITED',
  "bonusCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InfluencerInvite_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "InfluencerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "InfluencerProfile_email_key" ON "InfluencerProfile"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "InfluencerProfile_referralSlug_key" ON "InfluencerProfile"("referralSlug");
CREATE UNIQUE INDEX IF NOT EXISTS "InfluencerProfile_referralCode_key" ON "InfluencerProfile"("referralCode");
`)

db.close()
console.log(`SQLite database ready at ${dbPath}`)
