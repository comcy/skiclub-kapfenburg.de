import { RequestHandler } from 'express';
import nodemailer from 'nodemailer';
import { EmailRequestBody } from '../domain/email';
import dotenv from 'dotenv';

dotenv.config();

// Serverkonfiguration und Umgebungsvariablen
const SMTP_SERVER = process.env.SMTP_SERVER || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SENDER_MAIL = process.env.SENDER_MAIL || '';
const SENDER_PW = process.env.SENDER_PW || '';

export const sendEmail: RequestHandler = async (req, res) => {
  const { to, subject, text, cc = '', bcc = '', from = '' } = req.body as EmailRequestBody;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(to)) {
    res.status(400).json({ error: "Ungültige Empfänger-E-Mail-Adresse." });
    return; 
  }
  if (cc && cc.trim() !== '' && !emailRegex.test(cc)) {
    res.status(400).json({ error: "Ungültige CC-E-Mail-Adresse." });
    return;
  }
  if (bcc && bcc.trim() !== '' && !emailRegex.test(bcc)) {
    res.status(400).json({ error: "Ungültige BCC-E-Mail-Adresse." });
    return;
  }
  
  // SMTP Transporter erstellen
  const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SENDER_MAIL,
      pass: SENDER_PW,
    },
    tls: { rejectUnauthorized: false },
    socketTimeout: 10000,
    connectionTimeout: 10000,
  });

  const mailOptions = {
    from: from || SENDER_MAIL,
    cc,
    bcc,
    to,
    subject,
    html: text,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-Mail gesendet:", info.messageId);
    res.status(200).json({
      message: "E-Mail erfolgreich gesendet",
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("Fehler beim Senden der E-Mail:", error);
    const responseCode = error.responseCode || 500;
    res.status(responseCode).json({ error: "Fehler beim Senden der E-Mail", details: error.message });
  }
};