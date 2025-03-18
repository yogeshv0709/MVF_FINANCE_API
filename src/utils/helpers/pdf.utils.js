const axios = require("axios");
const path = require("path");
const fs = require("fs");

function addDocumentHeader(doc, report, pageWidth) {
  const logoPath = path.join(__dirname, "../../mvf-logo.jpeg");
  // Check if the file exists before adding it
  if (fs.existsSync(logoPath)) {
    // doc.image(logoPath, 50, 50, { width: 50, height: 50 });
    const image = doc.openImage(logoPath);
    const aspectRatio = image.width / image.height;

    // Define maximum dimensions
    const maxWidth = 50;
    const maxHeight = 50;

    // Calculate scaled dimensions while preserving aspect ratio
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    // Add the image with calculated dimensions
    doc.image(logoPath, 50, 50, { width, height });
  } else {
    // Draw a placeholder if the image is missing
    doc.rect(50, 50, 50, 50).stroke("#cccccc");
    doc.fontSize(10).text("LOGO", 63, 70);
  }

  // Header text
  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor("#2c3e50")
    .text("Farmer Report", doc.page.margins.left + 70, 65, { width: pageWidth - 70 });

  // Report Date & ID
  const reportDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#7f8c8d")
    .text(`Report Date: ${reportDate}`, { align: "right" })
    .text(`Report ID: ${report._id}`, { align: "right" });

  // Add horizontal line
  doc
    .moveTo(doc.page.margins.left, 120)
    .lineTo(pageWidth + doc.page.margins.left, 120)
    .strokeColor("#e0e0e0")
    .stroke();

  doc.moveDown(1);
}
function addReportDetails(doc, report) {
  // Create a light background box
  const boxY = doc.y;
  const boxHeight = 100; // Reduced height since alert notifications are moved out

  doc
    .rect(
      doc.page.margins.left,
      boxY,
      doc.page.width - doc.page.margins.left - doc.page.margins.right,
      boxHeight
    )
    .fillAndStroke("#f9f9f9", "#e0e0e0");

  doc.y = boxY + 15;

  // Two-column layout for farmer details
  const colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right - 20) / 2;

  // Left column
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#2c3e50")
    .text("Farmer Information", doc.page.margins.left + 10, doc.y);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#34495e")
    .text(`Name: ${report.farmerId.farmerName}`, doc.page.margins.left + 10, doc.y + 20)
    .text(
      `Contact: ${report.farmerId.contactNumber || "Not Available"}`,
      doc.page.margins.left + 10,
      doc.y + 5
    )
    .text(
      `Email: ${report.farmerId.email || "Not Available"}`,
      doc.page.margins.left + 10,
      doc.y + 5
    );

  // Right column
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#2c3e50")
    .text("Report Status", doc.page.margins.left + colWidth + 20, boxY + 15);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#34495e")
    .text(`Status: ${report.status || "Active"}`, doc.page.margins.left + colWidth + 20, doc.y + 20)
    .text(
      `Last Updated: ${report.updatedAt ? new Date(report.updatedAt).toLocaleString() : "N/A"}`,
      doc.page.margins.left + colWidth + 20,
      doc.y + 5
    )
    .text(
      `Field ID: ${report.farmerId.fieldId}`,
      doc.page.margins.left + colWidth + 20,
      doc.y + 5 // Fixed position relative to the box start
    );

  // Set Y position after the box
  doc.y = boxY + boxHeight + 20;

  // Alert notifications outside the box with better styling for large text
  if (report.alert_notifications) {
    // Create a light alert background
    const alertY = doc.y;
    const alertWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // Calculate text height with proper padding
    const textHeight = calculateAlertHeight(doc, report.alert_notifications, alertWidth - 20);
    const padding = 15; // Increased padding
    const alertBoxHeight = textHeight + padding * 2; // Add padding to top and bottom

    doc
      .roundedRect(doc.page.margins.left, alertY, alertWidth, alertBoxHeight, 5)
      .fillAndStroke("#fff7f7", "#ffdddd");

    const iconX = doc.page.margins.left + 10;
    const iconY = alertY + padding; // Use padding for top margin

    // Alert header text
    doc
      .fillColor("#c0392b")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Alert Notifications:", iconX, iconY);

    // Alert content with proper spacing
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#e74c3c")
      .text(report.alert_notifications, doc.page.margins.left + 10, null, {
        width: alertWidth - 20,
        align: "left",
        lineGap: 3, // Increased line gap for better readability
      });

    // Update Y position after alert box with additional spacing
    doc.y = alertY + alertBoxHeight + 15;
  } else {
    // No alerts to display
    doc
      .font("Helvetica-Oblique")
      .fontSize(10)
      .fillColor("#7f8c8d")
      .text("No alert notifications for this report.", {
        align: "left",
      });

    doc.y += 10; // Add some spacing after the "no alerts" text
  }

  doc.moveDown(1);
}

// Improved helper function to calculate the height needed for alert text
function calculateAlertHeight(doc, text, width) {
  const fontSize = 10;
  const lineGap = 3;

  // Better estimate of characters per line
  const avgCharPerLine = Math.floor(width / (fontSize * 0.5));

  // Calculate number of lines (simple approach)
  const words = text.split(" ");
  let currentLineLength = 0;
  let lineCount = 1;

  for (const word of words) {
    if (currentLineLength + word.length + 1 > avgCharPerLine) {
      lineCount++;
      currentLineLength = word.length;
    } else {
      currentLineLength += word.length + 1;
    }
  }

  // Calculate height based on font size and line gap
  return lineCount * (fontSize + lineGap) + fontSize;
}

// Helper function to calculate the height needed for alert text
function calculateAlertHeight(doc, text, width) {
  const tempFont = doc.font("Helvetica");
  const tempFontSize = 10;
  const lineGap = 2;

  // We need to estimate how many lines the text will take
  // This is a simplified calculation and might need adjustment
  const avgCharPerLine = width / (tempFontSize * 0.5); // rough estimate
  const numLines = Math.ceil(text.length / avgCharPerLine);

  return numLines * (tempFontSize + lineGap) + 10; // Add some padding
}

async function addImagesSection(doc, images, pageHeight, pageWidth) {
  // Section Header
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#2c3e50")
    .text("Field Images", { underline: true });
  doc.moveDown(0.5);

  // Description
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#34495e")
    .text("The following images were captured during the field assessment:", { lineGap: 5 });
  doc.moveDown(1);

  // Image parameters
  const maxWidth = Math.min(250, (pageWidth - 20) / 2);
  const maxHeight = 180;
  const imagesPerRow = 2;
  const horizontalGap = 20;
  const verticalGap = 60;

  let xPos = doc.page.margins.left;
  let yPos = doc.y;
  let rowHeight = 0;

  for (const [index, img] of images.entries()) {
    if (!img?.images?.trim()) continue;

    try {
      // Start new row if needed
      if (index > 0 && index % imagesPerRow === 0) {
        xPos = doc.page.margins.left;
        yPos += rowHeight + verticalGap;
        rowHeight = 0;
      }

      // Check if we need a new page
      if (yPos + maxHeight + 50 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        yPos = doc.page.margins.top;
        xPos = doc.page.margins.left;
        rowHeight = 0;
      }

      const imageResponse = await axios.get(img.images, {
        responseType: "arraybuffer",
        timeout: 10000,
      });
      const imageBuffer = Buffer.from(imageResponse.data);
      const image = doc.openImage(imageBuffer);

      // Calculate dimensions maintaining aspect ratio
      const aspectRatio = image.width / image.height;
      let width = maxWidth;
      let height = width / aspectRatio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // Update row height if this image is taller
      const totalImageHeight = height + 40; // Image + caption
      if (totalImageHeight > rowHeight) {
        rowHeight = totalImageHeight;
      }

      // Add styled container with shadow effect
      doc
        .save()
        .roundedRect(xPos - 5, yPos - 5, width + 10, height + 35, 5)
        .fillAndStroke("#ffffff", "#dddddd")
        .restore();

      // Add image
      doc.image(imageBuffer, xPos, yPos, { width, height });

      // Add caption with description
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#7f8c8d")
        .text(
          `Image ${index + 1}: ${img.imagedescription || "No description"}`,
          xPos,
          yPos + height + 5,
          {
            width: width,
            align: "center",
            lineBreak: true,
          }
        );

      xPos += maxWidth + horizontalGap;
    } catch (error) {
      console.error(`Failed to process image ${img.images}:`, error);

      doc
        .save()
        .roundedRect(xPos - 5, yPos - 5, maxWidth + 10, 50, 5)
        .fillAndStroke("#fff0f0", "#ffcccc")
        .restore();

      doc
        .fontSize(10)
        .fillColor("#e74c3c")
        .text(`Image ${index + 1}: Failed to load - ${error.message}`, xPos, yPos + 15, {
          width: maxWidth,
          align: "center",
        });

      if (50 > rowHeight) {
        rowHeight = 50;
      }

      xPos += maxWidth + horizontalGap;
    }
  }

  // Move cursor after all images
  doc.y = yPos + rowHeight + 20;

  // Add a divider
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(pageWidth + doc.page.margins.left, doc.y)
    .strokeColor("#e0e0e0")
    .stroke();

  doc.moveDown(1);
}

function addSummarySection(doc, report) {
  // Check if we need a new page
  if (doc.y + 200 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }

  // Summary header
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#2c3e50")
    .text("Summary & Recommendations", { underline: true });
  doc.moveDown(0.5);

  // Summary content
  if (report.summary) {
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#34495e").text("Field Assessment Summary:");

    doc.font("Helvetica").fontSize(10).fillColor("#34495e").text(report.summary, { lineGap: 2 });
    doc.moveDown(1);
  }

  // Recommendations
  if (report.recommendations) {
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#34495e").text("Recommendations:");

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#34495e")
      .text(report.recommendations, { lineGap: 2 });
  }

  doc.moveDown(2);
}

function addDocumentFooter(doc) {
  const totalPages = doc.bufferedPageRange().count;

  // Add footer to each page
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);

    const footerY = doc.page.height - doc.page.margins.bottom - 20;

    // Add horizontal line
    doc
      .moveTo(doc.page.margins.left, footerY)
      .lineTo(doc.page.width - doc.page.margins.right, footerY)
      .strokeColor("#e0e0e0")
      .stroke();

    // Left side: Generation date
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#7f8c8d")
      .text(`Generated on: ${new Date().toLocaleString()}`, doc.page.margins.left, footerY + 5, {
        lineBreak: false,
      });

    // Right side: Page number
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#7f8c8d")
      .text(
        `Page ${i + 1} of ${totalPages}`,
        doc.page.width - doc.page.margins.right - 70,
        footerY + 5,
        { align: "right", lineBreak: false }
      );
  }
}

module.exports = {
  addImagesSection,
  addDocumentFooter,
  addDocumentHeader,
  addReportDetails,
  addSummarySection,
};
