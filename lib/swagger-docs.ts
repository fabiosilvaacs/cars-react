/**
 * @swagger
 * components:
 *   schemas:
 *     Marca:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Toyota
 *     MarcaBody:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           example: Toyota
 *     Modelo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Corolla
 *         marcaId:
 *           type: integer
 *           example: 1
 *         marca:
 *           type: string
 *           example: Toyota
 *     ModeloBody:
 *       type: object
 *       required:
 *         - nome
 *         - marcaId
 *       properties:
 *         nome:
 *           type: string
 *           example: Corolla
 *         marcaId:
 *           type: integer
 *           example: 1
 *     Carro:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         modeloId:
 *           type: integer
 *           example: 1
 *         marcaId:
 *           type: integer
 *           example: 1
 *         modelo:
 *           type: string
 *           example: Corolla
 *         marca:
 *           type: string
 *           example: Toyota
 *         ano:
 *           type: integer
 *           example: 2023
 *         combustivel:
 *           type: string
 *           example: Gasolina
 *         numPortas:
 *           type: integer
 *           example: 4
 *         cor:
 *           type: string
 *           example: Prata
 *         valor:
 *           type: number
 *           example: 80000
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CarroBody:
 *       type: object
 *       required:
 *         - modeloId
 *         - ano
 *         - combustivel
 *         - numPortas
 *         - cor
 *         - valor
 *       properties:
 *         modeloId:
 *           type: integer
 *           example: 1
 *         ano:
 *           type: integer
 *           example: 2023
 *         combustivel:
 *           type: string
 *           example: Gasolina
 *         numPortas:
 *           type: integer
 *           example: 4
 *         cor:
 *           type: string
 *           example: Prata
 *         valor:
 *           type: number
 *           example: 80000
 *     CarroUpdateBody:
 *       type: object
 *       properties:
 *         modeloId:
 *           type: integer
 *           example: 1
 *         ano:
 *           type: integer
 *           example: 2024
 *         combustivel:
 *           type: string
 *           example: Etanol
 *         numPortas:
 *           type: integer
 *           example: 2
 *         cor:
 *           type: string
 *           example: Vermelho
 *         valor:
 *           type: number
 *           example: 85000
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Recurso não encontrado
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/marcas:
 *   get:
 *     tags:
 *       - Marcas
 *     summary: Lista todas as marcas
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Marca'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Marcas
 *     summary: Cria uma nova marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarcaBody'
 *     responses:
 *       201:
 *         description: Marca criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Marca já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/marcas/{id}:
 *   get:
 *     tags:
 *       - Marcas
 *     summary: Busca uma marca pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Marca encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marca não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags:
 *       - Marcas
 *     summary: Atualiza uma marca
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarcaBody'
 *     responses:
 *       200:
 *         description: Marca atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marca não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Nome já em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Marcas
 *     summary: Remove uma marca
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Marca removida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marca não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Marca possui carros vinculados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/modelos:
 *   get:
 *     tags:
 *       - Modelos
 *     summary: Lista todos os modelos
 *     responses:
 *       200:
 *         description: Lista de modelos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Modelo'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Modelos
 *     summary: Cria um novo modelo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModeloBody'
 *     responses:
 *       201:
 *         description: Modelo criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Modelo'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Modelo já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/modelos/{id}:
 *   get:
 *     tags:
 *       - Modelos
 *     summary: Busca um modelo pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Modelo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Modelo'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags:
 *       - Modelos
 *     summary: Atualiza um modelo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModeloBody'
 *     responses:
 *       200:
 *         description: Modelo atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Modelo'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Nome já em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Modelos
 *     summary: Remove um modelo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Modelo removido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Modelo possui carros vinculados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/carros:
 *   get:
 *     tags:
 *       - Carros
 *     summary: Lista todos os carros
 *     responses:
 *       200:
 *         description: Lista de carros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carro'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Carros
 *     summary: Cria um novo carro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarroBody'
 *     responses:
 *       201:
 *         description: Carro criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/carros/{id}:
 *   get:
 *     tags:
 *       - Carros
 *     summary: Busca um carro pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Carro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Carro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags:
 *       - Carros
 *     summary: Atualiza parcialmente um carro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarroUpdateBody'
 *     responses:
 *       200:
 *         description: Carro atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       400:
 *         description: Dados inválidos ou nenhum campo enviado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Carro ou modelo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Carros
 *     summary: Remove um carro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Carro removido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Carro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export {};
