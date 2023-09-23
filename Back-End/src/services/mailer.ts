import express from "express";
import nodemailer from "nodemailer";

import env from "../utils/env";
import logger from "../utils/logger";

const router = express.Router();

/** Reusable transporter object using SMTP transport. */
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.email.username,
    pass: env.email.password,
  },
});

// Verify SMTP connection configuration
(async () => {
  try {
    await transporter.verify();
    logger.info("SMTP server has been setup successfully.");
  } catch (error) {
    logger.error(`An error occured trying to setup the SMTP server: ${error}`);
  }
})();

router.get("/", (req, res) => {
  res.send("Mailer home page");
});

router.post("/send-test-email", async (req, res) => {
  // Check if the request has the required fields.
  if (!req.body.to) {
    res.send({ success: false, message: "Missing required field: to" });
    return;
  }

  // Request parameters.
  const to = req.body.to;

  // Setup email data.
  const mailOptions = {
    from: '"LabTrack" <labtrack@unis.edu.gt>',
    to,
    subject: "LabTrack: Correo de Prueba",
    text: "Este es un correo de prueba enviado desde LabTrack.",
    html: "<p>Este es un correo de prueba enviado desde LabTrack.</p>",
  };

  // Attempt to send the email.
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.debug(`Test email sent to ${info.envelope.to}`);
    res.send({ success: true, message: `Test email sent to ${info.envelope.to}` });
  } catch (error) {
    logger.error(`An error occured trying to send the test email: ${error}`);
    res.send({ success: false, message: `An error occured trying to send the test email: ${error}` });
  }
});

export default router;
