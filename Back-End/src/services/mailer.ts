import { Router } from "express";
import nodemailer from "nodemailer";
import env from "../utils/env";
import logger from "../utils/logger";

const router = Router();

// TODO: refactor the code to separate the controllers from the routes
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

/** Generate the email HTML string with a parametrized body. */
const generateEmailHTML = (body: string, footer: string) => {
  return `<div style="background-color: #f5f5f5">
  <div style="padding: 10px">
    <table style="border: 1px solid #dedede; border-spacing: 0px; width: 100%; max-width: 600px; background-color: #ffffff" align="center">
      <tbody>
        <tr>
          <td>
            <table role="presentation" style="width: 100%">
              <tbody>
                <tr>
                  <td style="vertical-align: top" align="center">
                    <div
                      style="color: #263238; font-weight: 700; font-size: 20px; font-family: Google Sans, Roboto, sans-serif; line-height: 26px; padding: 0 0;">
                      <a style="text-decoration: none; color: #455a64" href="${env.frontend.host}:${env.frontend.port}" target="_blank">
                        <p>LabTrack</p>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: top; padding: 30px 25px; border-top: 1px solid #e0e0e0; font-weight: 400; font-size: 14px; line-height: 22px; color: #455a64;">
            ${body}
          </td>
        </tr>
        <tr>
          <td style=" vertical-align: top; background-color: #f4f4f6; color: #4d4d4d; font-weight: 400; font-size: 12px; line-height: 16px; padding: 20px 25px; text-align: center; ">
            <p style="text-align: center; font-size: 12px; font-family: Roboto, arial; font-family: Roboto, arial; color: #757575; margin: 0">
              <strong>Correo enviado desde LabTrack</strong>
            </p>
            <p style="margin: 10px 0 0 0">
              ${footer}
            </p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; vertical-align: top; background-color: #7b001e; padding: 24px 24px">
            <table style="width: 100%; border: 0; border-spacing: 0px; border-collapse: separate; padding: 0">
              <tbody>
                <tr>
                  <td align="left" valign="middle">
                    <p style="color: #f4f4f6; font-weight: 700; font-size: 20px; font-family: Google Sans, Roboto, sans-serif; line-height: 26px; padding: 0 0;">
                      <a style="text-decoration: none; color: #f4f4f6" href="${env.frontend.host}:${env.frontend.port}" target="_blank">
                        LabTrack
                      </a>
                    </p>
                  </td>
                  <td align="right" valign="middle" style="color: #d6dde1; font-weight: 400; font-size: 12px; line-height: 14px; padding: 0 0;">
                    <p style="text-decoration: none; color: #f4f4f6">Universidad del Istmo</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;
};

router.get("/mailer", (req, res) => {
  res.send("Mailer home page");
});

router.post("/mailer/send-test-email", async (req, res) => {
  logger.debug("POST /mailer/send-test-email");

  // Check if the request has the required fields.
  if (!req.body.to) {
    res.send({ success: false, message: "Missing required field: to" });
    return;
  }

  // Request parameters.
  const to = req.body.to;

  // Email body and footer.
  const body = "<p>Este es un correo de prueba enviado desde LabTrack.</p>";
  const footer = "Ha recibido este correo electrónico como prueba.";

  // Setup email data.
  const mailOptions = {
    from: '"LabTrack" <labtrack@unis.edu.gt>',
    to,
    subject: "LabTrack: Correo de Prueba",
    text: "Este es un correo de prueba enviado desde LabTrack.",
    html: generateEmailHTML(body, footer),
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

const formatDate = (date: string) => {
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = months[dateObject.getMonth()];
  const year = dateObject.getFullYear();
  return `${day} de ${month} de ${year}`;
};

router.post("/mailer/send-inquiry-confirmation-email", async (req, res) => {
  logger.info("POST /mailer/send-inquiry-confirmation-email");

  // Check if the request has the required fields.
  const requiredFields = ["to", "name", "project", "description", "devices", "timelapse", "acceptURL"];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      res.send({ success: false, message: `Missing required field: ${field}` });
      return;
    }
  }

  // Request parameters.
  const { to, name, project, description, devices, timelapse } = req.body;

  // Inquiry devices.
  let devicesString = "<ul>";
  for (const device of devices) {
    devicesString += `<li><strong>Nombre:</strong> ${device.name}</li>
    <li><strong>Cantidad:</strong> ${device.quantity}</li>`;
  }
  devicesString += "</ul>";

  // Email body and footer.
  const body = `<div>
  <p>Estimado(a) ${name},</p>
  <p>El motivo de este correo es para confirmar que se ha recibido su solicitud de apertura de proyecto en LabTrack.</p>
  <p>Los detalles de su solicitud son los siguientes:</p>
  <ul>
    <li><strong>Nombre del proyecto:</strong> ${project}</li>
    <li><strong>Descripción del proyecto:</strong> ${description}</li>
    <li><strong>Dispositivos:</strong> ${devicesString}</li>
    <li><strong>Duración:</strong> <ul>
      <li><strong>Fecha de inicio:</strong> ${formatDate(timelapse.start)}</li>
      <li><strong>Fecha de finalización:</strong> ${formatDate(timelapse.end)}</li>
    </ul></li>
  </ul>
  <p>Para continuar con el proceso de apertura de proyecto, por favor haga clic en el siguiente enlace:</p>
  <div style="line-height:16px;text-align:center;margin-bottom:16px">
    <a style="font-size:14px;font-weight:500;padding:10px 20px;letter-spacing:.25px;text-decoration:none;text-transform:none;display:inline-block;border-radius:8px;background-color:#1a73e8;color:#fff" href="${
      req.body.acceptURL
    }">Aceptar solicitud</a>
  </div>
  <p>Si el enlace no funciona, por favor copie y pegue la siguiente URL en su navegador:</p>
  <div style="font-weight:400;font-size:14px;line-height:20px;color:rgba(0,0,0,.87)">
    <a href="${req.body.acceptURL}" target="_blank">${req.body.acceptURL}</a>
  </div>
  <p>Le estaremos notificando cuando su proyecto haya sido aprobado.</p>
  <p>Atentamente,</p>
  <p>LabTrack</p>
</div>`;
  const footer =
    "<p>Ha recibido este correo electrónico como confirmación de su solicitud.</p><p>Si usted no ha realizado esta solicitud, por favor ignore este correo.</p>";

  // Setup email data.
  const mailOptions = {
    from: '"LabTrack" <labtrack@unis.edu.gt>',
    to,
    subject: "LabTrack: Confirmación de Solicitud de Apertura de Proyecto",
    text: "Este es un correo de prueba enviado desde LabTrack.",
    html: generateEmailHTML(body, footer),
  };

  // Attempt to send the email.
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Inquiry confirmation email sent to ${info.envelope.to}`);
    res.send({ success: true, message: `Inquiry confirmation email sent to ${info.envelope.to}` });
  } catch (error) {
    logger.error(`An error occured trying to send the inquiry confirmation email: ${error}`);
    res.send({ success: false, message: `An error occured trying to send the inquiry confirmation email: ${error}` });
  }
});

router.post("/mailer/send-new-project-inquiry-opening-email", async (req, res) => {
  // TODO: add a direct URL field to open the project in the frontend
  logger.info("POST /mailer/send-new-project-opening-email");

  // Check if the request has the required fields.
  const requiredFields = ["to", "name", "project", "description", "devices", "timelapse"];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      res.send({ success: false, message: `Missing required field: ${field}` });
      return;
    }
  }

  // Request parameters.
  const { to, name, project, description, devices, timelapse } = req.body;

  // Inquiry devices.
  let devicesString = "<ul>";
  for (const device of devices) {
    devicesString += `<li><strong>Nombre:</strong> ${device.name}</li>
    <li><strong>Cantidad:</strong> ${device.quantity}</li>`;
  }
  devicesString += "</ul>";

  // Email body and footer.
  const body = `<div>
  <p>Notificación de apertura de proyecto en LabTrack.</p>
  <p>Los detalles de la solicitud son los siguientes:</p>
  <p><strong>Nombre del solicitante:</strong> ${name}</p>
  <ul>
    <li><strong>Nombre del proyecto:</strong> ${project}</li>
    <li><strong>Descripción del proyecto:</strong> ${description}</li>
    <li><strong>Dispositivos:</strong> ${devicesString}</li>
    <li><strong>Duración:</strong> <ul>
      <li><strong>Fecha de inicio:</strong> ${formatDate(timelapse.start)}</li>
      <li><strong>Fecha de finalización:</strong> ${formatDate(timelapse.end)}</li>
    </ul></li>
  </ul>
  <p>Atentamente,</p>
  <p>LabTrack</p>
</div>`;
  const footer = "<p>Ha recibido este correo electrónico como notificación de apertura de proyecto porque usted es un administrador del sistema.</p>";

  // Setup email data.
  const mailOptions = {
    from: '"LabTrack" <labtrack@unis.edu.gt>',
    to,
    subject: "LabTrack: Notificación de Apertura de Proyecto",
    text: "Este es un correo de prueba enviado desde LabTrack.",
    html: generateEmailHTML(body, footer),
  };

  // Attempt to send the email.
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`New project opening email sent to ${info.envelope.to}`);
    res.send({ success: true, message: `New project opening email sent to ${info.envelope.to}` });
  } catch (error) {
    logger.error(`An error occured trying to send the new project opening email: ${error}`);
    res.send({ success: false, message: `An error occured trying to send the new project opening email: ${error}` });
  }
});

export default router;
