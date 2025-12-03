const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const GMAIL_USER = "cuetcsejobfair2025@gmail.com";
const GMAIL_APP_PASSWORD = "ibvdningskxrngqt";

// TODO: UPDATE THE EMAIL LIST WITH THE RECIPIENT EMAILS
const emails = [
  // "u2004038@student.cuet.ac.bd", // abrar vai
  // "u2004067@student.cuet.ac.bd", // rakib vai
  // "u2004115@student.cuet.ac.bd", // ashir vai
  // "u2004058@student.cuet.ac.bd", // fahim vai
  // "u2104105@student.cuet.ac.bd",  // manon
  // "u2104072@student.cuet.ac.bd",
  "tanjim.haider.12112100@gmail.com",
  // "u2104055@student.cuet.ac.bd",
  // "u2204072@student.cuet.ac.bd",
  // "u2204093@student.cuet.ac.bd",
  // "u2204067@student.cuet.ac.bd",
  // "u2204116@student.cuet.ac.bd",
  // "u2204094@student.cuet.ac.bd",
  // "u2204092@student.cuet.ac.bd",
  // "u2204101@student.cuet.ac.bd",
  // "u2204097@student.cuet.ac.bd",
  // "u2204078@student.cuet.ac.bd",
  // "hr@bracits.com",
  // "shahriyar.hassan@bevycommerce.com",
  // "head.service@basis.org.bd",
  // "contact@w3eden.com",
  // "it@rilogroup.com",
  // "shahriare@magnetismtech.com",

  // "secretariat@basis.org.bd",  // basis
  // "jobs@echologyx.com",


  // "bp@banglapuzzle.com",
  // "contact@vivasoftltd.com",
  // "careers@hntelcom.com",
  // "support@lion-coders.com",
  // "info@digitpulp.com",
  // "hrd@helloworldbd.com",
  // "support@copotronic.com",
  // "office@v-linknetwork.com",
  // "nazimesl@gmail.com",
  // "jobs@theobuddy.ai",
  // "contact@marswave.ai",
  // "hr@satellitecablebd.com",
  // "hr@satellitecablebd.com",
  // "info@firstnfast.com",
  // "hr@researchbuddy.ai",
  // "hrd@helloworldbd.com",
  // "support@speedlinks.com.bd",
  // "info@sebatelecom.com",
  // "info@bbts.net",
  // "info@asciisys.com",
  // "info@rmitltd.com",
  // "support@link3.net",
  // "info.mime@cg-bd.com",
  // "support@icc-communication.com",
  // "hrd@helloworldbd.com",
  // "info@nxgit.com",
  // "spark774433@gmail.com",
  // "ceo@colbd.com",
  // "sales@wisdomdish.com",
  // "ceo@citl.com.bd",
  // "support@xponent.com.bd",
  // "mslctg2012@gmail.com",
  // "a_quader@hotmail.com",
  // "pinnacle_of_success@yahoo.com",
  // "omar@neosysworld.com",
  // "texturesoftwaretechnologyltd@gmail.com",
  // "moin@xceedbd.com",
  // "bjaddt@gmail.com",
  // "admin@digitallabbd.com",
  // "info@magnetismtech.com",
  // "mail@thetork.com",
  // "info@extreme.com.bd",
  // "shishir@timesit.com",
  // "hello@avistaseo.com",
  // "info@wwsoftt.com",
  // "ceo@colbd.com",
  // "info@ics-bd.com",
  // "info@samm.com.bd",
  // "careers@zentabd.com"


  "hasanshahriare@gmail.com",

];

// TODO: UPDATE THE SUBJECT IF NEEDED
// const EMAIL_SUBJECT = "CUET CSE Job Fair 2025!";
const EMAIL_SUBJECT = "Reminder — Only 2 Days Left to Register for CUET CSE Job Fair 2025.";
// const EMAIL_SUBJECT = 'Invitation: CUET CSE Career Fair 2025 - Connect with Engineering Talent';

const emailTemplatePath = path.join(__dirname, "emailTemplateThreeDaysRemaining.html");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

const updateJsonFile = (filePath, newEmails) => {
  let existingEmails = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      if (fileContent) {
        const parsedData = JSON.parse(fileContent);
        if (Array.isArray(parsedData)) {
          existingEmails = parsedData;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading or parsing ${filePath}:`, error);
  }

  const emailSet = new Set(existingEmails);
  newEmails.forEach((email) => emailSet.add(email));

  try {
    fs.writeFileSync(filePath, JSON.stringify(Array.from(emailSet), null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
};

app.get("/send-emails", async (req, res) => {
  console.log("Received request to /send-emails");

  let emailTemplate;
  try {
    emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
  } catch (error) {
    console.error("Error reading email template:", error);
    return res.status(500).json({ error: "Could not read email template." });
  }

  console.log(`Starting to send emails to ${emails.length} recipients...`);

  const stats = {
    totalEmails: emails.length,
    successful: 0,
    failed: 0,
    failures: [],
  };

  const successfulEmails = [];
  const failedEmails = [];

  for (const email of emails) {
    const mailOptions = {
      from: `"CUET CSE Job Fair 2025" <${GMAIL_USER}>`,
      to: email,
      cc: ["animesh_roy@cuet.ac.bd", "pranabdhar81@cuet.ac.bd"],
      subject: EMAIL_SUBJECT,
      html: emailTemplate,
      attachments: [
        {
          filename: 'Job Fair Invitation.pdf',
          path: 'https://drive.google.com/uc?export=download&id=151X-kf_rf-9Olx4XBObAA_zomhfb0BsM'
        }
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Successfully sent email to ${email}`);
      stats.successful++;
      successfulEmails.push(email);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      stats.failed++;
      stats.failures.push({ email, error: error.message });
      failedEmails.push(email);
    }

    // Add a 1-second delay between emails to avoid rate limiting
    if (emails.indexOf(email) < emails.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (successfulEmails.length > 0) {
    updateJsonFile(
      path.join(__dirname, "successful-mails.json"),
      successfulEmails
    );
  }

  if (failedEmails.length > 0) {
    updateJsonFile(path.join(__dirname, "failed-mails.json"), failedEmails);
  }

  console.log("--- Email Sending Complete ---");
  console.log(`Successful: ${stats.successful}, Failed: ${stats.failed}`);
  console.log("-----------------------------");

  res.status(200).json(stats);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(
    `Visit http://localhost:${port}/send-emails to start sending emails.`
  );
});
