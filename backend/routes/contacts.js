const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const sendEmail = require("../config/nodemailer");
const { log } = require("console");

// POST /api/contacts
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Save to DB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email
await sendEmail({
  to: "nan1dhakumar@gmail.com",
  subject: `New Inquiry from ${name}`,
  text: `You received a new inquiry from ${name} (${email}):\n\n${message}`,
  html: `
    <h3>New Inquiry</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  `,
});

// Send confirmation email to sender
await sendEmail({
  to: email, // send to the user's email
  subject: "Thank you for contacting My Portfolio",
  text: `Hi ${name},\n\nThanks for reaching out! I'll get back to you soon.\n\n- My Portfolio`,
});


    res.status(200).json({
      message: "Contact form submitted successfully.",
      data: newContact,
    });
    log("API hit...", req.body, req.method);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving inquiry." });
  }
});

module.exports = router;
