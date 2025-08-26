import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // STARTTLS upgrade
  auth: {
    user: process.env.SMTP_USER, // your Brevo SMTP user (API key)
    pass: process.env.SMTP_PASS, // your Brevo SMTP password
  },
});

export const sendEmail = async ({ to, subject, body }) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL, // must be a verified Brevo sender
      to,
      subject,
      html: body,
    });
    console.log("✅ Email sent successfully:", response.messageId);
    return response;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};
