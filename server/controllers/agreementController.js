const Agreement = require("../models/Agreement");
const Booking = require("../models/Booking");
const PDFDocument = require("pdfkit");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const generateAgreement = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("owner", "name")
      .populate("renter", "name")
      .populate("item", "name");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "Accepted") {
      return res
        .status(400)
        .json({ message: "Agreement only for accepted bookings" });
    }

    const agreementId = `AGR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    //  PDF memory buffer
    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    doc.fontSize(20).text("BORRVIO RENTAL AGREEMENT", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Agreement ID: ${agreementId}`);
    doc.text(`Date: ${new Date().toDateString()}`);
    doc.moveDown();
    doc.text(`Owner: ${booking.owner.name}`);
    doc.text(`Renter: ${booking.renter.name}`);
    doc.text(`Item: ${booking.item.name}`);
    doc.moveDown();
    doc.text(`Rental Start: ${new Date(booking.startDate).toDateString()}`);
    doc.text(`Rental End: ${new Date(booking.endDate).toDateString()}`);
    doc.text(`Total Days: ${booking.totalDays}`);
    doc.moveDown();
    doc.text(`Total Amount: ₹${booking.totalAmount}`);
    doc.text(`Security Deposit: ₹${booking.depositAmount}`);
    doc.moveDown();
    doc.text(
      "Terms: Item must be returned in same condition. Damage will result in deposit deduction.",
      {
        width: 410,
        align: "justify",
      },
    );
    doc.end();

    // PDF ready  wait
    await new Promise((resolve) => doc.on("end", resolve));
    const pdfBuffer = Buffer.concat(chunks);

    //  Cloudinary  upload
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "agreements", public_id: agreementId },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      Readable.from(pdfBuffer).pipe(uploadStream);
    });

    //  DB mein Cloudinary URL save
    const agreement = await Agreement.create({
      booking: booking._id,
      agreementId,
      ownerName: booking.owner.name,
      renterName: booking.renter.name,
      itemName: booking.item.name,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
      depositAmount: booking.depositAmount,
      pdfUrl: uploadResult.secure_url,
    });

    res.status(201).json({
      message: "Agreement generated successfully",
      agreementId,
      pdfUrl: uploadResult.secure_url,
      agreement,
    });
  } catch (error) {
    console.error("Agreement error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

const getAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findOne({
      booking: req.params.bookingId,
    });
    if (!agreement)
      return res.status(404).json({ message: "Agreement not found" });
    res.status(200).json(agreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateAgreement, getAgreement };
