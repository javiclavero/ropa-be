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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "uploads");
        console.log("Upload path:", uploadPath);
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, "temp.jpg");
    },
});
const upload = (0, multer_1.default)({ storage: storage });
database_1.default
    .sync()
    .then(() => console.log("Base de datos sincronizada"))
    .catch((err) => console.error("Error al sincronizar la base de datos:", err));
app.post("/api/clothing-items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { CloType } = req.body;
    try {
        let whereClause = {};
        if (CloType) {
            whereClause = { CloType: parseInt(CloType, 10) };
        }
        const clothes = yield Cloth_1.default.findAll({ where: whereClause });
        res.json(clothes);
    }
    catch (error) {
        console.error("Error al obtener prendas:", error);
        res.status(500).json({ error: "Error al obtener prendas" });
    }
}));
app.post("/api/clothing-add", (req, res, next) => {
    console.log("Llamada recibida en /api/clothing-add");
    next();
}, upload.single("imagen"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prenda, tipoPrenda } = req.body;
        const newCloth = yield Cloth_1.default.create({
            CloName: prenda,
            CloType: tipoPrenda,
            CloCreatedAt: new Date(),
            CloUpdatedAt: new Date(),
        });
        console.log("HERE");
        if (req.file) {
            const imagePath = path_1.default.join(__dirname, "uploads", `cloth-${newCloth.CloId}.jpg`);
            fs_1.default.rename(req.file.path, imagePath, (err) => {
                if (err) {
                    console.error("Error al renombrar la imagen:", err);
                    res.status(500).json({ error: "Error al subir la imagen" });
                    return;
                }
            });
        }
        else {
            res.status(400).json({ error: "Imagen no subida" });
            return;
        }
        res
            .status(201)
            .json({ message: "Prenda añadida correctamente", prenda: newCloth });
    }
    catch (error) {
        console.error("Error al añadir la prenda:", error);
        res.status(500).json({ error: "Error al añadir la prenda" });
    }
}));
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
