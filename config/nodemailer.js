// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail", // or use SMTP like: host: "smtp.mailtrap.io"
//   auth: {
//     user: process.env.EMAIL_USER, // use env for security
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     await transporter.sendMail({
//       from: `"My Portfolio" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });
//     console.log("📧 Email sent successfully!");
//   } catch (error) {
//     console.error("❌ Email send failed:", error);
//   }
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"My Portfolio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.error("❌ Email send failed:", error);
  }
};

module.exports = sendEmail;
