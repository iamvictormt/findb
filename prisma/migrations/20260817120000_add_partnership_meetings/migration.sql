CREATE TABLE "MeetingSlot" (
    "id" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingSlot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartnershipMeeting" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnershipMeeting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MeetingSlot_startsAt_endsAt_key" ON "MeetingSlot"("startsAt", "endsAt");
CREATE INDEX "MeetingSlot_startsAt_idx" ON "MeetingSlot"("startsAt");
CREATE INDEX "MeetingSlot_isActive_startsAt_idx" ON "MeetingSlot"("isActive", "startsAt");
CREATE UNIQUE INDEX "PartnershipMeeting_slotId_key" ON "PartnershipMeeting"("slotId");
CREATE INDEX "PartnershipMeeting_email_createdAt_idx" ON "PartnershipMeeting"("email", "createdAt");
CREATE INDEX "PartnershipMeeting_status_createdAt_idx" ON "PartnershipMeeting"("status", "createdAt");

ALTER TABLE "PartnershipMeeting" ADD CONSTRAINT "PartnershipMeeting_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MeetingSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
