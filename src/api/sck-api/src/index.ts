import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { sendEmail } from './controllers/email-controller';

const app = express();

// App config
app.use(express.json());
app.use(cors());

// Route registrieren
app.post("/send_email", sendEmail);

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
