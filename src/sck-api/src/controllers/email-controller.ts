/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailRequestBody } from "../domain/email.js";
import { saveData } from "../services/data-service.js";

dotenv.config();

const SMTP_SERVER = process.env.SMTP_SERVER || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SENDER_MAIL = process.env.SENDER_MAIL || "";
const SENDER_PW = process.env.SENDER_PW || "";

const parseEmailList = (value?: string): string[] => {
  if (!value) return [];
  return value
    .split(/[,;]+/) // avoid errors on "," and ";"
    .map(addr => addr.trim())
    .filter(addr => addr.length > 0);
};

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const sendEmail: RequestHandler = async (req, res) => {
  try {
    const emailData = req.body as EmailRequestBody;

    // E-Mail-Daten speichern
    await saveData('email-contact', emailData);

    const { to, subject, text, cc, bcc, from } = emailData;

    const toList = parseEmailList(to);
    const ccList = parseEmailList(cc);
    const bccList = parseEmailList(bcc);

    if (toList.length === 0 || !toList.every(isValidEmail)) {
      res.status(400).json({ error: "Ungültige Empfänger-E-Mail-Adresse." });
      return;
    }

    if (ccList.length > 0 && !ccList.every(isValidEmail)) {
      res.status(400).json({ error: "Ungültige CC-E-Mail-Adresse." });
      return;
    }

    if (bccList.length > 0 && !bccList.every(isValidEmail)) {
      res.status(400).json({ error: "Ungültige BCC-E-Mail-Adresse." });
      return;
    }

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
      to: toList.join(","),
      cc: ccList.length ? ccList.join(",") : undefined,
      bcc: bccList.length ? bccList.join(",") : undefined,
      subject,
      html: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("E-Mail gesendet:", info.messageId);

    res.status(200).json({
      message: "E-Mail erfolgreich gesendet",
      messageId: info.messageId,
      to: toList,
      cc: ccList,
      bcc: bccList,
      subject,
    });
  } catch (error: any) {
    console.error("Fehler beim Senden der E-Mail:", error);
    res.status(500).json({
      error: "Fehler beim Senden der E-Mail",
      details: error.message || error.toString(),
    });
  }
};
