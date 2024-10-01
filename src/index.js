"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const Cloth_1 = __importDefault(require("./models/Cloth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Sincronizar Sequelize con la base de datos
database_1.default.sync()
    .then(() => console.log('Base de datos sincronizada'))
    .catch((err) => console.error('Error al sincronizar la base de datos:', err));


// Endpoint para obtener prendas filtradas por tipo (CloType)
app.get('/api/clothing-items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CloType } = req.query;
    try {
        let whereClause = {};
        if (CloType) {
            whereClause = { CloType: parseInt(CloType, 10) }; // Convertimos a entero
        }
        const clothes = yield Cloth_1.default.findAll({ where: whereClause });
        res.json(clothes);
    }
    catch (error) {
        console.error('Error al obtener prendas:', error);
        res.status(500).json({ error: 'Error al obtener prendas' });
    }
}));



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
