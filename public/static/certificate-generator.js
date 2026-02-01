/**
 * VonWillingh Online Certificate Generator
 * Uses jsPDF for client-side PDF generation
 */

class CertificateGenerator {
  constructor() {
    this.jsPDF = window.jspdf.jsPDF;
  }

  /**
   * Generate a professional certificate PDF
   * @param {Object} data - Certificate data
   * @param {string} data.studentName - Full name of student
   * @param {string} data.courseName - Name of completed course
   * @param {string} data.courseLevel - Level (Certificate, Diploma, Bachelor, Honours, Master, Doctorate)
   * @param {string} data.completionDate - Date of completion (YYYY-MM-DD)
   * @param {string} data.certificateId - Unique certificate ID
   * @returns {Blob} - PDF blob
   */
  async generate(data) {
    const {
      studentName,
      courseName,
      courseLevel,
      completionDate,
      certificateId
    } = data;

    // Create PDF in landscape A4 format
    const doc = new this.jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Background and border
    this.addBorder(doc, width, height);

    // Header - PBK Logo and Institute Name
    this.addHeader(doc, width);

    // Certificate Title
    this.addTitle(doc, width);

    // Award Text
    this.addAwardText(doc, width, studentName);

    // Course Information
    this.addCourseInfo(doc, width, courseName, courseLevel);

    // Completion Date
    this.addCompletionDate(doc, width, completionDate);

    // Certificate ID
    this.addCertificateId(doc, width, height, certificateId);

    // Signatures
    this.addSignatures(doc, width, height);

    // Footer
    this.addFooter(doc, width, height);

    // Return PDF as blob
    return doc.output('blob');
  }

  /**
   * Add decorative border
   */
  addBorder(doc, width, height) {
    // Outer border - gold color
    doc.setDrawColor(139, 115, 85); // Dark goldenrod
    doc.setLineWidth(2);
    doc.rect(10, 10, width - 20, height - 20);

    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, width - 30, height - 30);

    // Corner decorations
    doc.setFillColor(184, 134, 11);
    const cornerSize = 5;
    // Top-left
    doc.circle(15, 15, cornerSize, 'F');
    // Top-right
    doc.circle(width - 15, 15, cornerSize, 'F');
    // Bottom-left
    doc.circle(15, height - 15, cornerSize, 'F');
    // Bottom-right
    doc.circle(width - 15, height - 15, cornerSize, 'F');
  }

  /**
   * Add header with logo and institute name
   */
  addHeader(doc, width) {
    // Add logo if available
    try {
      const logo = document.getElementById('vonwillinghLogoImage');
      if (logo && logo.complete) {
        // Center the logo at the top
        const logoWidth = 30;
        const logoHeight = 30;
        doc.addImage(logo, 'PNG', width / 2 - logoWidth / 2, 20, logoWidth, logoHeight);
      }
    } catch (err) {
      console.log('Logo image not available');
    }

    // Institute name (moved down to accommodate logo)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(139, 115, 85); // Brown/Gold
    doc.text('VONWILLINGH ONLINE', width / 2, 63, { align: 'center' });

    // Tagline
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('AI-Powered Business Training', width / 2, 75, { align: 'center' });
  }

  /**
   * Add certificate title
   */
  addTitle(doc, width) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(139, 115, 85); // Brown/Gold
    doc.text('CERTIFICATE OF COMPLETION', width / 2, 90, { align: 'center' });

    // Underline
    doc.setDrawColor(139, 115, 85);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 80, 92, width / 2 + 80, 92);
  }

  /**
   * Add award text
   */
  addAwardText(doc, width, studentName) {
    // "This is to certify that"
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to certify that', width / 2, 105, { align: 'center' });

    // Student name - larger and bold
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(139, 115, 85); // Brown/Gold
    doc.text(studentName, width / 2, 120, { align: 'center' });

    // Underline for name
    const nameWidth = doc.getTextWidth(studentName);
    doc.setDrawColor(139, 115, 85);
    doc.setLineWidth(0.3);
    doc.line(width / 2 - nameWidth / 2, 122, width / 2 + nameWidth / 2, 122);
  }

  /**
   * Add course information
   */
  addCourseInfo(doc, width, courseName, courseLevel) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('has successfully completed the requirements for', width / 2, 135, { align: 'center' });

    // Just show the course name (no level prefix)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    
    // Course name with text wrapping if too long
    const maxWidth = 200;
    const lines = doc.splitTextToSize(courseName, maxWidth);
    let yPos = 148;
    lines.forEach(line => {
      doc.text(line, width / 2, yPos, { align: 'center' });
      yPos += 8;
    });
  }

  /**
   * Add completion date
   */
  addCompletionDate(doc, width, completionDate) {
    const formattedDate = this.formatDate(completionDate);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date of Completion: ${formattedDate}`, width / 2, 160, { align: 'center' });
  }

  /**
   * Add certificate ID
   */
  addCertificateId(doc, width, height, certificateId) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Certificate ID: ${certificateId}`, width / 2, height - 12, { align: 'center' });
  }

  /**
   * Add signature lines with actual signature images
   */
  addSignatures(doc, width, height) {
    const leftX = width / 2 - 80;  // Moved further left (was 60)
    const rightX = width / 2 + 80; // Moved further right (was 60)
    const signatureY = height - 40;
    const lineLength = 50;

    // Try to add signature images if available
    try {
      // Left signature image (MJ Gumede - Director)
      const sig1 = document.getElementById('signature1Image');
      if (sig1 && sig1.complete && sig1.naturalWidth > 0) {
        doc.addImage(sig1, 'PNG', leftX - 25, signatureY - 15, 50, 12);
      }

      // Right signature image (S Von Willingh - Operations Manager)
      const sig2 = document.getElementById('signature2Image');
      if (sig2 && sig2.complete && sig2.naturalWidth > 0) {
        doc.addImage(sig2, 'PNG', rightX - 25, signatureY - 15, 50, 12);
      }
    } catch (err) {
      console.log('Signature images not available, using text signatures', err);
    }

    // Left signature line and text
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(leftX - lineLength / 2, signatureY, leftX + lineLength / 2, signatureY);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('MJ Gumede', leftX, signatureY + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Director', leftX, signatureY + 10, { align: 'center' });

    // Right signature line and text
    doc.line(rightX - lineLength / 2, signatureY, rightX + lineLength / 2, signatureY);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('S Von Willingh', rightX, signatureY + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Operations Manager', rightX, signatureY + 10, { align: 'center' });
  }

  /**
   * Add footer with institute details
   */
  addFooter(doc, width, height) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('sarrol@vonwillingh.co.za | 081 216 3629', width / 2, height - 7, { align: 'center' });
  }

  /**
   * Format date to readable string
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Generate certificate ID
   */
  static generateCertificateId(studentId, courseId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VW-${courseId}-${random}-${timestamp.toString().substring(8)}`;
  }

  /**
   * Download PDF directly
   */
  async downloadPDF(data, filename = 'certificate.pdf') {
    const blob = await this.generate(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Export for use in other scripts
window.CertificateGenerator = CertificateGenerator;
