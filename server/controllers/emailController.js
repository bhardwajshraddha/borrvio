const resend = require("../config/emailConfig");

const sendBookingRequestEmail = async (
  ownerEmail,
  ownerName,
  itemName,
  renterName,
) => {
  try {
    await resend.emails.send({
      from: "Borrvio <onboarding@resend.dev>",
      to: ownerEmail,
      subject: `New Booking Request — Borrvio`,
      html: `
        <h2>New Booking Request!</h2>
        <p>Hi <b>${ownerName}</b>,</p>
        <p><b>${renterName}</b> has requested to rent your item: <b>${itemName}</b></p>
        <p>Login to Borrvio to accept or decline the request.</p>
        <br/>
        <p>Team Borrvio 🚀</p>
      `,
    });
    console.log("Email sent!");
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

const sendBookingAcceptedEmail = async (renterEmail, renterName, itemName) => {
  try {
    await resend.emails.send({
      from: "Borrvio <onboarding@resend.dev>",
      to: renterEmail,
      subject: `Booking Accepted — Borrvio`,
      html: `
        <h2>Booking Accepted!</h2>
        <p>Hi <b>${renterName}</b>,</p>
        <p>Your booking for <b>${itemName}</b> has been accepted!</p>
        <p>Login to Borrvio to view your booking details.</p>
        <br/>
        <p>Team Borrvio 🚀</p>
      `,
    });
    console.log("Booking accepted email sent!");
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

const sendBookingCancelledEmail = async (email, name, itemName) => {
  try {
    await resend.emails.send({
      from: "Borrvio <onboarding@resend.dev>",
      to: email,
      subject: `Booking Cancelled — Borrvio`,
      html: `
        <h2>Booking Cancelled</h2>
        <p>Hi <b>${name}</b>,</p>
        <p>Booking for <b>${itemName}</b> has been cancelled.</p>
        <br/>
        <p>Team Borrvio 🚀</p>
      `,
    });
    console.log("Cancellation email sent!");
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

module.exports = {
  sendBookingRequestEmail,
  sendBookingAcceptedEmail,
  sendBookingCancelledEmail,
};
