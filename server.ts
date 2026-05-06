import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import nodemailer from "nodemailer";

// Configuração do transportador de e-mail (Exemplo com Gmail)
// Em produção, use variáveis de ambiente para estas credenciais
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'seu-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua-senha-app'
    }
});

async function sendRentalReminder(userEmail: string, rentalId: string, endTime: string) {
    const mailOptions = {
        from: '"Lab & Equipment Manager" <noreply@lab.com>',
        to: userEmail,
        subject: 'Lembrete de Aluguel de Equipamento',
        text: `Olá! Seu aluguel (ID: ${rentalId}) vence em ${new Date(endTime).toLocaleTimeString()}. Por favor, devolva o item no horário para evitar multas.`,
        html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">Lembrete de Aluguel</h2>
        <p>Olá! Este é um lembrete automático do seu aluguel de equipamento/produto.</p>
        <p><strong>ID do Aluguel:</strong> ${rentalId}</p>
        <p><strong>Horário de Devolução:</strong> ${new Date(endTime).toLocaleTimeString()}</p>
        <p style="color: #666; font-size: 14px;">Lembre-se de pagar os 50% restantes no momento da entrega.</p>
      </div>
    `
    };

    try {
        // Nota: No ambiente de demonstração, isso pode falhar sem credenciais reais
        // await transporter.sendMail(mailOptions);
        console.log(`[E-MAIL SIMULADO] Enviado para ${userEmail}: Lembrete de devolução às ${new Date(endTime).toLocaleTimeString()}`);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Initialize SQLite Database
    const db = await open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });

    // Create tables if they don't exist
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT, -- 'equipamento', 'epi', 'tecnologia', etc.
      category TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id TEXT PRIMARY KEY,
      userId TEXT,
      productId TEXT,
      startTime TEXT,
      endTime TEXT,
      depositPaid INTEGER,
      remainingPaid INTEGER,
      status TEXT,
      price REAL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(productId) REFERENCES products(id)
    );
  `);

    // Seed initial data if empty
    const userCount = await db.get("SELECT COUNT(*) as count FROM users");
    if (userCount.count === 0) {
        // Senha padrão para o admin: admin123
        await db.run("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)", ["1", "Admin", "admin@empresa.com", "admin123", "admin"]);
        // Senha padrão para o usuário: usuario123
        await db.run("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)", ["2", "Usuário Padrão", "usuario@empresa.com", "usuario123", "user"]);
    }

    const productCount = await db.get("SELECT COUNT(*) as count FROM products");
    if (productCount.count === 0) {
        await db.run("INSERT INTO products (id, name, type, category, status) VALUES (?, ?, ?, ?, ?)", ["P1", "Furadeira de Impacto", "equipamento", "Ferramentas", "available"]);
        await db.run("INSERT INTO products (id, name, type, category, status) VALUES (?, ?, ?, ?, ?)", ["P2", "Kit de Proteção (EPI)", "epi", "Segurança", "available"]);
        await db.run("INSERT INTO products (id, name, type, category, status) VALUES (?, ?, ?, ?, ?)", ["P3", "Notebook Corporativo", "tecnologia", "TI", "available"]);
        await db.run("INSERT INTO products (id, name, type, category, status) VALUES (?, ?, ?, ?, ?)", ["P4", "Protetor Auricular Industrial", "epi", "Segurança", "available"]);
        await db.run("INSERT INTO products (id, name, type, category, status) VALUES (?, ?, ?, ?, ?)", ["P5", "Multímetro Digital", "equipamento", "Eletrônica", "available"]);
    }

    const settingsCount = await db.get("SELECT COUNT(*) as count FROM settings");
    if (settingsCount.count === 0) {
        await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ["return_hour", "08:00"]);
        await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ["return_location", "Almoxarifado Central - Setor A"]);
        await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ["semester_label", "2024.1"]);
    }

    // API Routes
    app.post("/api/login", async (req, res) => {
        const { email, password } = req.body;
        const user = await db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);

        if (user) {
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ error: "E-mail ou senha incorretos" });
        }
    });

    app.post("/api/users", async (req, res) => {
        const { adminId, name, email, password, role = "user" } = req.body;

        // Verificar se quem está criando é admin
        const admin = await db.get("SELECT * FROM users WHERE id = ? AND role = 'admin'", [adminId]);
        if (!admin) return res.status(403).json({ error: "Apenas administradores podem cadastrar novos usuários" });

        const id = Math.random().toString(36).substr(2, 9);
        try {
            await db.run("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)", [id, name, email, password, role]);
            res.status(201).json({ id, name, email, role });
        } catch (e) {
            res.status(400).json({ error: "E-mail já cadastrado" });
        }
    });

    app.get("/api/status", (req, res) => {
        res.json({ status: "ok" });
    });

    app.get("/api/products", async (req, res) => {
        const products = await db.all("SELECT * FROM products");
        res.json(products);
    });

    app.get("/api/settings", async (req, res) => {
        const settings = await db.all("SELECT * FROM settings");
        const settingsObj = settings.reduce((acc: any, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsObj);
    });

    app.post("/api/settings", async (req, res) => {
        const { adminId, return_hour, return_location, semester_label } = req.body;
        const admin = await db.get("SELECT * FROM users WHERE id = ? AND role = 'admin'", [adminId]);
        if (!admin) return res.status(403).json({ error: "Acesso negado" });

        await db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('return_hour', ?)", [return_hour]);
        await db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('return_location', ?)", [return_location]);
        await db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('semester_label', ?)", [semester_label]);

        res.json({ success: true });
    });

    app.get("/api/rentals", async (req, res) => {
        const rentals = await db.all("SELECT * FROM rentals");
        // Convert SQLite 0/1 to boolean for the frontend
        const formattedRentals = rentals.map(r => ({
            ...r,
            depositPaid: !!r.depositPaid,
            remainingPaid: !!r.remainingPaid
        }));
        res.json(formattedRentals);
    });

    app.post("/api/rentals", async (req, res) => {
        const { userId, productId, startTime, durationHours } = req.body;

        const product = await db.get("SELECT * FROM products WHERE id = ?", [productId]);
        if (!product || product.status !== "available") {
            return res.status(400).json({ error: "Produto indisponível" });
        }

        // Regra de duração: equipamentos pesados ou EPIs específicos podem ter prazos diferentes.
        // Padrão: 4h se não especificado.
        const finalDuration = durationHours || 4;

        const start = new Date(startTime);
        const hours = start.getHours();
        const day = start.getDay(); // 0: Dom, 1: Seg, ..., 5: Sex, 6: Sáb

        let calculatedEndTime: Date;

        // Buscar configurações de devolução
        const settings = await db.all("SELECT * FROM settings");
        const settingsObj = settings.reduce((acc: any, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        const [configHour, configMin] = (settingsObj.return_hour || "08:00").split(':').map(Number);

        // Se alugado entre 19h e 21h, regra do próximo dia útil
        if (hours >= 19 && hours <= 21) {
            calculatedEndTime = new Date(start);
            if (day >= 1 && day <= 4) {
                // Segunda a Quinta -> Devolve amanhã no horário configurado
                calculatedEndTime.setDate(start.getDate() + 1);
                calculatedEndTime.setHours(configHour, configMin, 0, 0);
            } else if (day === 5) {
                // Sexta -> Devolve na próxima Segunda no horário configurado
                calculatedEndTime.setDate(start.getDate() + 3);
                calculatedEndTime.setHours(configHour, configMin, 0, 0);
            } else {
                calculatedEndTime = new Date(start.getTime() + finalDuration * 60 * 60 * 1000);
            }
        } else {
            calculatedEndTime = new Date(start.getTime() + finalDuration * 60 * 60 * 1000);
        }

        const rentalId = Math.random().toString(36).substr(2, 9);
        const endTime = calculatedEndTime.toISOString();
        const price = product.type === 'epi' ? 10 : 15;

        await db.run(
            "INSERT INTO rentals (id, userId, productId, startTime, endTime, depositPaid, remainingPaid, status, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [rentalId, userId, productId, startTime, endTime, 1, 0, "active", price]
        );

        await db.run("UPDATE products SET status = 'rented' WHERE id = ?", [productId]);

        // Buscar e-mail do usuário para notificação
        const user = await db.get("SELECT email FROM users WHERE id = ?", [userId]);
        if (user && user.email) {
            sendRentalReminder(user.email, rentalId, endTime);
        }

        const rental = {
            id: rentalId,
            userId,
            productId,
            startTime,
            endTime,
            depositPaid: true,
            remainingPaid: false,
            status: "active",
            price
        };

        res.status(201).json(rental);
    });

    app.post("/api/rentals/:id/return", async (req, res) => {
        const { id } = req.params;
        const rental = await db.get("SELECT * FROM rentals WHERE id = ?", [id]);
        if (!rental) return res.status(404).json({ error: "Rental not found" });

        await db.run("UPDATE rentals SET status = 'returned', remainingPaid = 1 WHERE id = ?", [id]);
        await db.run("UPDATE products SET status = 'available' WHERE id = ?", [rental.productId]);

        const updatedRental = await db.get("SELECT * FROM rentals WHERE id = ?", [id]);
        res.json({
            ...updatedRental,
            depositPaid: !!updatedRental.depositPaid,
            remainingPaid: !!updatedRental.remainingPaid
        });
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
            res.sendFile(path.join(distPath, "index.html"));
        });
    }

    app.put("/api/users/profile", async (req, res) => {
        const { userId, name, email, currentPassword, newPassword } = req.body;

        const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        // Se estiver tentando mudar a senha, valida a antiga
        if (newPassword && user.password !== currentPassword) {
            return res.status(401).json({ error: "Senha atual incorreta" });
        }

        const updatedName = name || user.name;
        const updatedEmail = email || user.email;
        const updatedPassword = newPassword || user.password;

        await db.run(
            "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
            [updatedName, updatedEmail, updatedPassword, userId]
        );

        res.json({ message: "Perfil atualizado com sucesso", user: { id: userId, name: updatedName, email: updatedEmail, role: user.role } });
    });

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();