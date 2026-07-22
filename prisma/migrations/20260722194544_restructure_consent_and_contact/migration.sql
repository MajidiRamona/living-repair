-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Initiative" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "street" TEXT,
    "country" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "domain" TEXT NOT NULL,
    "repairSector" TEXT NOT NULL,
    "repairCategories" JSONB NOT NULL,
    "orgTypes" JSONB NOT NULL,
    "activities" JSONB NOT NULL,
    "audience" JSONB NOT NULL,
    "peopleInvolved" TEXT,
    "knowledgeSkills" TEXT,
    "heritageDimension" TEXT,
    "challengesAndThreats" TEXT,
    "challengesPublic" BOOLEAN NOT NULL DEFAULT false,
    "needs" JSONB,
    "founded" INTEGER,
    "peopleReached" INTEGER,
    "itemsRepaired" INTEGER,
    "co2SavedT" REAL,
    "materialsDivertedKg" REAL,
    "socialCohesionScore" INTEGER,
    "sdgAlignment" JSONB NOT NULL DEFAULT [],
    "keywords" JSONB NOT NULL DEFAULT [],
    "website" TEXT,
    "socialMedia" TEXT,
    "photoPath" TEXT,
    "videoUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "hiddenFields" JSONB,
    "submissionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Initiative_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Initiative" ("activities", "audience", "challengesAndThreats", "challengesPublic", "city", "co2SavedT", "country", "createdAt", "description", "domain", "featured", "founded", "heritageDimension", "hiddenFields", "id", "itemsRepaired", "keywords", "knowledgeSkills", "lat", "lng", "materialsDivertedKg", "name", "needs", "orgTypes", "peopleInvolved", "peopleReached", "photoPath", "published", "region", "repairCategories", "repairSector", "sdgAlignment", "slug", "socialCohesionScore", "socialMedia", "street", "submissionId", "tagline", "updatedAt", "videoUrl", "website") SELECT "activities", "audience", "challengesAndThreats", "challengesPublic", "city", "co2SavedT", "country", "createdAt", "description", "domain", "featured", "founded", "heritageDimension", "hiddenFields", "id", "itemsRepaired", "keywords", "knowledgeSkills", "lat", "lng", "materialsDivertedKg", "name", "needs", "orgTypes", "peopleInvolved", "peopleReached", "photoPath", "published", "region", "repairCategories", "repairSector", "sdgAlignment", "slug", "socialCohesionScore", "socialMedia", "street", "submissionId", "tagline", "updatedAt", "videoUrl", "website" FROM "Initiative";
DROP TABLE "Initiative";
ALTER TABLE "new_Initiative" RENAME TO "Initiative";
CREATE UNIQUE INDEX "Initiative_slug_key" ON "Initiative"("slug");
CREATE UNIQUE INDEX "Initiative_submissionId_key" ON "Initiative"("submissionId");
CREATE INDEX "Initiative_published_idx" ON "Initiative"("published");
CREATE INDEX "Initiative_repairSector_idx" ON "Initiative"("repairSector");
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "name" TEXT,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "activities" JSONB NOT NULL,
    "activitiesOtherText" TEXT,
    "repairCategories" JSONB NOT NULL,
    "repairCategoriesOtherText" TEXT,
    "orgTypes" JSONB NOT NULL,
    "orgTypesOtherText" TEXT,
    "peopleInvolved" TEXT,
    "knowledgeSkills" TEXT,
    "heritageDimension" TEXT,
    "challengesAndThreats" TEXT,
    "needs" JSONB,
    "needsOtherText" TEXT,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "socialMedia" TEXT,
    "street" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "audience" JSONB NOT NULL,
    "photoPath" TEXT,
    "videoUrl" TEXT,
    "publicationConsent" TEXT NOT NULL DEFAULT 'NO',
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
-- contactName/publicationConsent are brand new columns with no source data — backfill with a
-- safe, clearly-marked placeholder / the most conservative consent value (NO) rather than
-- letting this migration fail if any pre-existing submissions happen to be sitting in
-- production. COALESCE guards email too, since it used to be nullable.
INSERT INTO "new_Submission" ("activities", "activitiesOtherText", "adminNotes", "audience", "challengesAndThreats", "city", "country", "createdAt", "description", "email", "heritageDimension", "id", "knowledgeSkills", "lat", "lng", "name", "needs", "needsOtherText", "orgTypes", "orgTypesOtherText", "peopleInvolved", "photoPath", "region", "rejectionReason", "repairCategories", "repairCategoriesOtherText", "reviewedAt", "socialMedia", "status", "street", "tagline", "updatedAt", "videoUrl", "website", "contactName", "publicationConsent") SELECT "activities", "activitiesOtherText", "adminNotes", "audience", "challengesAndThreats", "city", "country", "createdAt", "description", COALESCE("email", ''), "heritageDimension", "id", "knowledgeSkills", "lat", "lng", "name", "needs", "needsOtherText", "orgTypes", "orgTypesOtherText", "peopleInvolved", "photoPath", "region", "rejectionReason", "repairCategories", "repairCategoriesOtherText", "reviewedAt", "socialMedia", "status", "street", "tagline", "updatedAt", "videoUrl", "website", '(not collected — migrated from an older submission)', 'NO' FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE INDEX "Submission_status_idx" ON "Submission"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

