/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { RequestHandler } from "express";
import { EmailRequestBody } from "../domain/email.js";
import { saveData } from "../services/data-service.js";
import { createMailTransporter, defaultSender } from "../services/mailer.js";

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

    const transporter = createMailTransporter();

    const mailOptions = {
      from: from || defaultSender(),
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
