const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Variable global para el pool de conexiones
let pool;

// Función con reintento automático para esperar a la base de datos
async function initDb() {
  let connected = false;
  let attempts = 0;
  
  while (!connected && attempts < 10) {
    try {
      console.log(`Intentando conectar a MySQL (intento ${attempts + 1})...`);
      
      pool = mysql.createPool({
        host: 'db', // Nombre del servicio en docker-compose
        user: 'root',
        password: 'admin123',
        database: 'innovatech_db',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10
      });

      // Prueba rápida para verificar que la BD responde
      await pool.query("SELECT 1");
      console.log("¡Conexión exitosa a la base de datos 'innovatech_db'!");
      connected = true;
    } catch (err) {
      attempts++;
      console.error("Base de datos no disponible, reintentando en 3 segundos...");
      // Espera 3 segundos antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  if (!connected) {
    console.error("No se pudo conectar a la base de datos tras 10 intentos.");
  }
}

function handleError(res, error, message = "Error interno del servidor") {
  console.error(error);
  res.status(500).json({ message });
}

// Rutas de API
app.get("/api/productos", async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Base de datos no conectada" });
  try {
    const [rows] = await pool.query("SELECT id, nombre, descripcion, precio, stock FROM productos ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    handleError(res, err, "No se pudieron obtener los productos.");
  }
});

app.post("/api/productos", async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Base de datos no conectada" });
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)",
      [nombre, descripcion || null, precio, stock]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion, precio, stock });
  } catch (err) { handleError(res, err); }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
  await initDb();
});