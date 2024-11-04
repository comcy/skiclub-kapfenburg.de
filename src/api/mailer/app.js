const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// SMTP Server Konfiguration
const SMTP_SERVER = "test";
const SMTP_PORT = 465; // Port 465 für SSL/TLS

const SENDER_MAIL = "test";
const SENDER_PW = "test";

app.post("/send_email", async (req, res) => {
  const { recipientEmail, subject, body } = req.body;

  if (!recipientEmail || !subject || !body) {
    return res
      .status(400)
      .json({ error: "Alle Felder müssen ausgefüllt sein." });
  }

  // Transporter erstellen
  const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: true, // SSL/TLS-Verschlüsselung aktivieren
    auth: {
      user: SENDER_MAIL,
      pass: SENDER_PW,
    },
  });

  // E-Mail-Details
  const mailOptions = {
    from: SENDER_MAIL,
    to: recipientEmail,
    subject: subject,
    text: body,
  };

  try {
    // E-Mail senden
    const info = await transporter.sendMail(mailOptions);
    console.log("E-Mail gesendet:", info.messageId);
    res.status(200).json({
      message: "E-Mail erfolgreich gesendet",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error);
    res
      .status(500)
      .json({ error: "Fehler beim Senden der E-Mail", details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
