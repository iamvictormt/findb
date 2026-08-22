ALTER TABLE "MeetingSlot" ADD COLUMN "country" TEXT NOT NULL DEFAULT 'Todos os países';

DROP INDEX IF EXISTS "MeetingSlot_startsAt_endsAt_key";

CREATE UNIQUE INDEX "MeetingSlot_country_startsAt_endsAt_key" ON "MeetingSlot"("country", "startsAt", "endsAt");
CREATE INDEX "MeetingSlot_country_startsAt_idx" ON "MeetingSlot"("country", "startsAt");
