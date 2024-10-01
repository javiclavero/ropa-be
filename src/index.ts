import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import Cloth from "./models/Cloth";
import path from "path";
import fs from "fs";
import multer from "multer";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    console.log("Upload path:", uploadPath); 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    cb(null, "temp.jpg"); 
  },
});

const upload = multer({ storage: storage });


sequelize
  .sync()
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.error("Error al sincronizar la base de datos:", err));


app.post("/api/clothing-items", async (req: Request, res: Response) => {
  const { CloType } = req.body;

  try {
    let whereClause = {};
    if (CloType) {
      whereClause = { CloType: parseInt(CloType as string, 10) }; 
    }

    const clothes = await Cloth.findAll({ where: whereClause });
    res.json(clothes);
  } catch (error) {
    console.error("Error al obtener prendas:", error);
    res.status(500).json({ error: "Error al obtener prendas" });
  }
});

app.post(
  "/api/clothing-add",
  (req, res, next) => {
    console.log("Llamada recibida en /api/clothing-add"); 
    next(); 
  },
  upload.single("imagen"),
  async (req: Request, res: Response) => {
    try {

      const { prenda, tipoPrenda } = req.body;

      const newCloth = await Cloth.create({
        CloName: prenda,
        CloType: tipoPrenda,
        CloCreatedAt: new Date(),
        CloUpdatedAt: new Date(),
      });

      console.log("HERE");

      if (req.file) {

        const imagePath = path.join(
          __dirname,
          "uploads",
          `cloth-${newCloth.CloId}.jpg`
        );
        fs.rename(req.file.path, imagePath, (err) => {
          if (err) {
            console.error("Error al renombrar la imagen:", err);
            res.status(500).json({ error: "Error al subir la imagen" });
            return;
          }
        });
      } else {
        res.status(400).json({ error: "Imagen no subida" });
        return;
      }
      res
        .status(201)
        .json({ message: "Prenda añadida correctamente", prenda: newCloth });
    } catch (error) {
      console.error("Error al añadir la prenda:", error);
      res.status(500).json({ error: "Error al añadir la prenda" });
    }
  }
);


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
