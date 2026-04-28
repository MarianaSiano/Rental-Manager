import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import nodemailer from 'nodemailer';
import { SubjectReferenceImage } from "@google/genai";

// Configuração do transportador de e-mail (Exemplo com Gmail)
// Em produção, use variáveis de ambiente para estas credenciais
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'seu-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua-senha-app'
    }
});

async function sendRentalRemider(userEmail: string, rentalId: string, endTime: string) {
    const mailOptions = {
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

    // Nota: No ambiente de demonstração, isso pode falhar sem credenciais reais
    // await transporter.sendMail(mailOptions);
    try {
        console.log(`[E-MAIL SIMULADO] Enviado para ${userEmail}: Lembrete de devolução às ${new Date(endTime).toLocaleTimeString()}`);
    } catch(error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}