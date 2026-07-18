-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repairCategories" JSONB NOT NULL,
    "repairCategoriesOtherText" TEXT,
    "orgTypes" JSONB NOT NULL,
    "orgTypesOtherText" TEXT,
    "peopleInvolved" TEXT,
    "activities" JSONB NOT NULL,
    "activitiesOtherText" TEXT,
    "knowledgeSkills" TEXT,
    "challengesAndThreats" TEXT,
    "challengesPublicRequested" BOOLEAN NOT NULL DEFAULT false,
    "needs" JSONB,
    "needsOtherText" TEXT,
    "needsPublicRequested" BOOLEAN NOT NULL DEFAULT false,
    "website" TEXT,
    "email" TEXT,
    "socialMedia" TEXT,
    "street" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "audience" JSONB NOT NULL,
    "heritageDimension" TEXT,
    "photoPath" TEXT,
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Initiative" (
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
    "needsPublic" BOOLEAN NOT NULL DEFAULT false,
    "founded" INTEGER,
    "peopleReached" INTEGER,
    "itemsRepaired" INTEGER,
    "co2SavedT" REAL,
    "materialsDivertedKg" REAL,
    "socialCohesionScore" INTEGER,
    "sdgAlignment" JSONB NOT NULL DEFAULT [],
    "keywords" JSONB NOT NULL DEFAULT [],
    "climateLink" TEXT,
    "website" TEXT,
    "email" TEXT,
    "emailPublic" BOOLEAN NOT NULL DEFAULT false,
    "socialMedia" TEXT,
    "photoPath" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "hiddenFields" JSONB,
    "submissionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Initiative_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Initiative_slug_key" ON "Initiative"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Initiative_submissionId_key" ON "Initiative"("submissionId");

-- CreateIndex
CREATE INDEX "Initiative_published_idx" ON "Initiative"("published");

-- CreateIndex
CREATE INDEX "Initiative_repairSector_idx" ON "Initiative"("repairSector");
