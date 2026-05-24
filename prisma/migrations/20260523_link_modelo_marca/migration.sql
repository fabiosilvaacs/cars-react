/*
  Warnings:

  - Added the required column `marcaId` to the `Modelo` table without a default value.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
CREATE TABLE "new_Modelo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "marcaId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Modelo_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Modelo" ("id", "nome", "createdAt", "marcaId") SELECT "id", "nome", "createdAt", 1 FROM "Modelo";
DROP TABLE "Modelo";
ALTER TABLE "new_Modelo" RENAME TO "Modelo";
CREATE UNIQUE INDEX "Modelo_nome_key" ON "Modelo"("nome");
CREATE INDEX "Modelo_marcaId_idx" ON "Modelo"("marcaId");
PRAGMA defer_foreign_keys=OFF;
