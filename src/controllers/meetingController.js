const path = require('path');
const db = require('../config/knex')
const transporter = require('../utils/mailer');
const dotenv = require('dotenv');

const { google } = require('googleapis');
const { findClassById, saveClassMeetLink, getClassMeetLink, getCategoryName } = require('../models/meetingModel');

const scopes = ['https://www.googleapis.com/auth/calendar'];

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

const calendar = google.calendar({
  version : "v3",
  auth : process.env.API_KEY
});

const generateUrl = async (req, res) => {
  const url = await oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  }); 

  res.redirect(url);
};

const redirect = async (req, res) => {
  const code = req.query.code;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  res.send({
    msg: "You have succesfully logged in",
  });
};

const createMeetLink = async (req, res) => {
  const { idClass } = req.body;
  const { id_user: teacherId, email: userEmail } = req.user; // Diambil dari middleware autentikasi

  try {
    const { email } = req.user;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const classData = await findClassById(idClass);
    // if (!classData || classData.id_teacher !== teacherId) {
    //   return res.status(403).json({ error: 'You are not authorized to create a meet link for this class' });
    // }
    const categoryData = await db('category_class').where({ id_category: classData.id_category }).first();

    // const calendar = getCalendarClient();
    // console.log(`calender : ${calender}`);
    const schedule = await db('schedule').where({ id_schedule: classData.id_schedule }).first();
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    // Pastikan schedule.date hanya berupa tanggal
    const dateOnly = new Date(schedule.day).toISOString().split('T')[0]; // Mengambil hanya bagian tanggal

    // Format start dan end times
    const startTime = new Date(`${dateOnly}T${schedule.start_time}`).toISOString();
    const endTime = new Date(`${dateOnly}T${schedule.end_time}`).toISOString();

    // Cek apakah waktu valid
    if (isNaN(new Date(startTime)) || isNaN(new Date(endTime))) {
      throw new Error('Invalid date or time format');
    }

    const summary = `Class: ${categoryData.name_category}`;

    const event = {
      summary: summary,
      start: { 
        dateTime: startTime, 
        timeZone: 'Asia/Jakarta' 
      },
      end: { 
        dateTime: endTime, 
        timeZone: 'Asia/Jakarta' 
      },
        conferenceData: {
          createRequest: {
            requestId: `${idClass}-${Date.now()}`, // Request ID unik
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      auth : oauth2Client,
      resource: event,
      conferenceDataVersion: 1,
    });
    console.log('Google Calendar API Response:', response.data);

    const meetLink = response.data.hangoutLink;

    await saveClassMeetLink(idClass, meetLink);
    console.log('Generated Meet Link:', meetLink);

    const meetLinkData = await db("classes as c")
    .join("category_class as cc", "c.id_category", "cc.id_category")
    .join("class_meeting_link as cml", "c.id_class", "cml.id_class")
    .join("schedule as s", "c.id_schedule", "s.id_schedule")
    .where("c.id_class", idClass)
    .select("cc.name_category",
      "cml.meet_link",
       "s.day",
       "s.start_time",
       "s.end_time") 
    .first();

    if (!meetLinkData) {
      return res.status(404).json({ error: 'Meet link not found' });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found. Please check the email address." });
    }

    // Format waktu untuk email
    const formattedDay = new Date(meetLinkData.day).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formattedStartTime = meetLinkData.start_time.slice(0, 5); // Mengambil format HH:MM
    const formattedEndTime = meetLinkData.end_time.slice(0, 5); // Mengambil format HH:MM

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Meet Link for Class ${meetLinkData.name_category}`,
      html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <div style="float: left; width: 60px; margin-top: -60px;">
                    <img src="cid:hiasan" alt="Corner Left Top Decoration" style="max-width: 100%; height: auto;">
                </div>
        
                <div style="float: right; width: 60px; margin-top: -60px;">
                    <img src="cid:hiasan" alt="Corner Right Top Decoration" style="max-width: 100%; height: auto;">
                </div>

                <h2 style="text-align: center; color: #007BFF;">Link Gmeet For Class ${meetLinkData.name_category}</h2>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="cid:core-path" alt="Company Logo" style="max-width: 100px;">
                </div>
                <p style="text-align: center;">The class is scheduled as follows:</p>
                <ul style="list-style-type: none; padding: 0; text-align: center;">
                  <li><strong>Date:</strong> ${formattedDay}</li>
                  <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime} (Asia/Jakarta)</li>
                </ul>
                <p style="text-align: center">Click the button below to enter the class </p>
                  <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                      <tr>
                          <td align="center" bgcolor="#007BFF" style="border-radius: 4px;">
                              <a href="${meetLinkData.meet_link}" 
                                 style="display: inline-block; font-size: 16px; color: #ffffff; text-decoration: none; padding: 10px 20px; background-color: #007BFF; border-radius: 4px;">
                                 Link Gmeet
                              </a>
                          </td>
                      </tr>
                  </table>
                  <p style="text-align: center">Don't forget to always learn new things</p>
                  <hr style="border: 0; border-top: 1px solid #ddd;">
                  <p style="text-align: center; font-size: 12px; color: #777;">
                      © 2025 Core-Path. All rights reserved.<br>
                      Need help? <a href="mailto:hawarihabib7@gmail.com" style="color: #007BFF;">Contact Support</a>.
                  </p>
                </div>
          `,
          attachments: [
          {
            filename: 'logo.jpeg',
            path: path.join(__dirname, '../utils/img/logo.jpeg'),
            cid: 'core-path' 
          },
          {
            filename: 'hiasan.jpeg', 
            path: path.join(__dirname, '../utils/img/hiasan.jpeg'),
            cid: 'hiasan'
          },
          ]
    });

    res.status(201).json({ message: 'Meet link created', meetLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create meet link' });
  }
};


const sendMeetLinkToStudent = async (req, res) => {
  const { idClass } = req.body;

  try {
    const { email } = req.user;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const meetLinkData = await db("classes as c")
    .join("category_class as cc", "c.id_category", "cc.id_category")
    .join("class_meeting_link as cml", "c.id_class", "cml.id_class")
    .join("schedule as s", "c.id_schedule", "s.id_schedule")
    .where("c.id_class", idClass)
    .select("cc.name_category",
       "cml.meet_link",
        "s.day",
        "s.start_time",
        "s.end_time")
    .first();

    if (!meetLinkData) {
      return res.status(404).json({ error: 'Meet link not found' });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found. Please check the email address." });
    }
    console.log(`Looking for email: ${email}`);

    // Format waktu untuk email
    const formattedDay = new Date(meetLinkData.day).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formattedStartTime = meetLinkData.start_time.slice(0, 5); // Mengambil format HH:MM
    const formattedEndTime = meetLinkData.end_time.slice(0, 5); // Mengambil format HH:MM

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Meet Link for Class ${meetLinkData.name_category}`,
      html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <div style="float: left; width: 60px; margin-top: -60px;">
                    <img src="cid:hiasan" alt="Corner Left Top Decoration" style="max-width: 100%; height: auto;">
                </div>
        
                <div style="float: right; width: 60px; margin-top: -60px;">
                    <img src="cid:hiasan" alt="Corner Right Top Decoration" style="max-width: 100%; height: auto;">
                </div>

                <h2 style="text-align: center; color: #007BFF;">Link Gmeet For Class ${meetLinkData.name_category}</h2>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="cid:core-path" alt="Company Logo" style="max-width: 100px;">
                </div>
                <p style="text-align: center;">The class is scheduled as follows:</p>
                <ul style="list-style-type: none; padding: 0; text-align: center;">
                  <li><strong>Date:</strong> ${formattedDay}</li>
                  <li><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime} (Asia/Jakarta)</li>
                </ul>
                <p style="text-align: center">Click the button below to enter the class </p>
                  <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                      <tr>
                          <td align="center" bgcolor="#007BFF" style="border-radius: 4px;">
                              <a href="${meetLinkData.meet_link}" 
                                 style="display: inline-block; font-size: 16px; color: #ffffff; text-decoration: none; padding: 10px 20px; background-color: #007BFF; border-radius: 4px;">
                                 Link Gmeet
                              </a>
                          </td>
                      </tr>
                  </table>
                  <p style="text-align: center">Don't forget to always learn new things</p>
                  <hr style="border: 0; border-top: 1px solid #ddd;">
                  <p style="text-align: center; font-size: 12px; color: #777;">
                      © 2025 Core-Path. All rights reserved.<br>
                      Need help? <a href="mailto:hawarihabib7@gmail.com" style="color: #007BFF;">Contact Support</a>.
                  </p>
                </div>
          `,
          attachments: [
          {
            filename: 'logo.jpeg',
            path: path.join(__dirname, '../utils/img/logo.jpeg'),
            cid: 'core-path' 
          },
          {
            filename: 'hiasan.jpeg', 
            path: path.join(__dirname, '../utils/img/hiasan.jpeg'),
            cid: 'hiasan'
          },
          ]
    });

    res.status(200).json({ message: 'Meet link sent to student' });

  } catch (error) {
    console.error('Error in sendMeetLinkToStudent:', error.message);  // Logging the actual error message
    res.status(500).json({ error: 'Failed to send meet link' });
  }
};


module.exports = { createMeetLink, sendMeetLinkToStudent, redirect, generateUrl };
