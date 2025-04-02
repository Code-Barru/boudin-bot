-- CreateTable
CREATE TABLE "DiscordUser" (
    "discordId" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "open" BOOLEAN NOT NULL DEFAULT true,
    "interactionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Drinks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "drinkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sessionId" TEXT,
    CONSTRAINT "Order_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "Drinks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DiscordUser" ("discordId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BiteOuCouilles" (
    "discordId" TEXT NOT NULL PRIMARY KEY,
    "won" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_UserSessions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserSessions_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscordUser" ("discordId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserSessions_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_discordId_key" ON "DiscordUser"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "BiteOuCouilles_discordId_key" ON "BiteOuCouilles"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserSessions_AB_unique" ON "_UserSessions"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSessions_B_index" ON "_UserSessions"("B");
