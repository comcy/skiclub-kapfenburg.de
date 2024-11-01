const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route für die Anmeldung und E-Mail-Bestätigung
app.post("/send-confirmation-email", async (req, res) => {
  //   const { email, name } = req.body;

  // Konfiguriere den Nodemailer-Transport
  let transporter = nodemailer.createTransport({
    service: "other", // Oder ein anderer E-Mail-Dienst
    auth: {
      user: "registration@skiclub-kapfenburg.de",
      pass: "_sck!passw0rdZZ!",
    },
  });

  console.log("SENDE ");
  // E-Mail-Inhalt definieren
  let mailOptions = {
    from: "registration@skiclub-kapfenburg.de",
    to: "christian.silfang@gmail.com",
    subject: "Bestätigung deiner Anmeldung",
    text: `Hallo 'name',\nvielen Dank für deine Anmeldung!`,
    html: `<p>Hallo name,</p><p>vielen Dank für deine Anmeldung!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Bestätigungsmail gesendet!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Fehler beim Senden der E-Mail" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
