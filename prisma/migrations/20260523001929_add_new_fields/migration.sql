/*
  Warnings:

  - You are about to drop the column `modelo` on the `Carro` table. All the data in the column will be lost.
  - Added the required column `combustivel` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cor` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modeloId` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numPortas` to the `Carro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `Carro` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Modelo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Carro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modeloId" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "marcaId" INTEGER NOT NULL,
    "combustivel" TEXT NOT NULL,
    "numPortas" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Carro_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Carro_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "Modelo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Carro" ("ano", "createdAt", "id", "marcaId") SELECT "ano", "createdAt", "id", "marcaId" FROM "Carro";
DROP TABLE "Carro";
ALTER TABLE "new_Carro" RENAME TO "Carro";
CREATE TABLE "new_Marca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Marca" ("id", "nome") SELECT "id", "nome" FROM "Marca";
DROP TABLE "Marca";
ALTER TABLE "new_Marca" RENAME TO "Marca";
CREATE UNIQUE INDEX "Marca_nome_key" ON "Marca"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Modelo_nome_key" ON "Modelo"("nome");
