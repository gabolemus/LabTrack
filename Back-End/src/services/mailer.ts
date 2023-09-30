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
const generateEmailHTML = (body: string) => {
  return `<div class=""><div class="aHl"></div><div id=":94" tabindex="-1"></div><div id=":aw" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc3ODMwMDYxNzYyNTk0OTUxMyIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3ODMwMDYxNzYyNTk0OTUxMyIsbnVsbCxbXSxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxbXSxbXSxbXV0."><div id=":ax" class="a3s aiL ">
  </div><div style="background-color:#f5f5f5">
    <div style="padding:10px">
      <table style="border:1px solid #dedede;border-spacing:0px;width:100%;max-width:600px;background-color:#ffffff" align="center">
        <tbody>
          <tr>
            <td>
              <table role="presentation" style="width:100%">
                <tbody>
                  <tr>
                    <td style="vertical-align:top" align="center">
                      <div style="color:#263238;font-weight:700;font-size:20px;font-family:Google Sans,Roboto,sans-serif;line-height:26px;padding:0 0">
                        <a style="text-decoration:none;color:#455a64" href="${env.frontend.host}:${env.frontend.port}" target="_blank">
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
            <td>
              <div style="height:0px;font-size:0px;max-height:0px;min-height:0px;line-height:0px;width:100%;color:#fff;display:none">Spark Projects will no longer be able to host executable files on Firebase</div>
            </td>
          </tr>
          <tr>
            <td style="vertical-align:top;padding:30px 25px;border-top:1px solid #e0e0e0;font-weight:400;font-size:14px;line-height:22px;color:#455a64">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="vertical-align:top;background-color:#f4f4f6;color:#4d4d4d;font-weight:400;font-size:12px;line-height:16px;padding:20px 25px;text-align:center">
              <p style="text-align:center;font-size:12px;font-family:Roboto,arial;font-family:Roboto,arial;color:#757575">
                <strong>Correo enviado desde LabTrack</strong>
                <br>
                Ha recibido este correo electrónico como prueba.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;vertical-align:top;background-color:#7b001e;padding:24px 24px">
              <table style="width:100%;border:0;border-spacing:0px;border-collapse:separate;padding:0">
                <tbody>
                  <tr>
                    <td align="left" valign="middle">
                      <p style="color:#f4f4f6;font-weight:700;font-size:20px;font-family:Google Sans,Roboto,sans-serif;line-height:26px;padding:0 0">
                        <a style="text-decoration:none;color:#f4f4f6" href="${env.frontend.host}:${env.frontend.port}" target="_blank">
                          LabTrack
                        </a>
                      </p>
                    </td>
                    <td align="right" valign="middle" style="color:#d6dde1;font-weight:400;font-size:12px;line-height:14px;padding:0 0">
                      <p style="text-decoration:none;color:#f4f4f6">
                        Universidad del Istmo
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div></div></div><div id=":90" class="ii gt" style="display:none"><div id=":8z" class="a3s aiL "></div></div><div class="hi"></div><div class="WhmR8e" data-hash="0"></div></div>`;
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

  // Setup email data.
  const mailOptions = {
    from: '"LabTrack" <labtrack@unis.edu.gt>',
    to,
    subject: "LabTrack: Correo de Prueba",
    text: "Este es un correo de prueba enviado desde LabTrack.",
    html: generateEmailHTML("<p>Este es un correo de prueba enviado desde LabTrack.</p>"),
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
