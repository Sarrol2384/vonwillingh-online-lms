/**
 * Email Service using Brevo API (formerly Sendinblue)
 * Handles all email notifications for VonWillingh Online LMS
 * FREE: 300 emails/day (9,000/month)
 */

interface EmailEnv {
  BREVO_API_KEY: string;
  FROM_EMAIL: string;
  CONTACT_EMAIL: string;
  // Keep for backward compatibility during transition
  RESEND_API_KEY?: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Brevo API
 * API Documentation: https://developers.brevo.com/docs/send-a-transactional-email
 */
export async function sendEmail(env: EmailEnv, params: SendEmailParams): Promise<boolean> {
  try {
    // Use Brevo API if key is available, otherwise fallback to Resend
    const useBrevo = env.BREVO_API_KEY && 
                     env.BREVO_API_KEY.length > 0 && 
                     env.BREVO_API_KEY !== 'your_brevo_api_key_here' &&
                     env.BREVO_API_KEY.startsWith('xkeysib-');
    
    console.log(`📧 Email Service: Using ${useBrevo ? '✅ BREVO (FREE)' : '⚠️  RESEND (Test Mode)'}`);
    
    if (useBrevo) {
      // Brevo API endpoint
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            email: env.FROM_EMAIL,
            name: 'VonWillingh Online'
          },
          to: [
            {
              email: params.to
            }
          ],
          subject: params.subject,
          htmlContent: params.html
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Brevo API error:', error);
        return false;
      }

      const data = await response.json();
      console.log('Email sent successfully via Brevo:', data);
      return true;
      
    } else {
      // Fallback to Resend API
      console.warn('BREVO_API_KEY not found, falling back to Resend');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: params.to,
          subject: params.subject,
          html: params.html
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Resend API error:', error);
        return false;
      }

      const data = await response.json();
      console.log('Email sent successfully via Resend:', data);
      return true;
    }
    
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

/**
 * Email Templates
 */

export function getApplicationReceivedEmail(studentName: string, courseName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2C3E50; color: white; padding: 30px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2C3E50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        h1 { margin: 0; }
        .highlight { color: #2C3E50; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>VonWillingh Online</h1>
          <p>Smart Business Training for Entrepreneurs</p>
        </div>
        <div class="content">
          <h2>Application Received ✓</h2>
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Thank you for your application to the <span class="highlight">${courseName}</span> program at VonWillingh Online.</p>
          <p>We have successfully received your application and all required documents. Our admissions team will review your application and get back to you within <strong>3-5 business days</strong>.</p>
          
          <h3>What Happens Next?</h3>
          <ol>
            <li><strong>Application Review:</strong> Our team will carefully review your application and documents</li>
            <li><strong>Decision:</strong> You will receive an email with our decision</li>
            <li><strong>If Approved:</strong> You'll receive payment instructions to complete your enrollment</li>
          </ol>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p><strong>VonWillingh Online</strong></p>
          <p>Email: sarrol@vonwillingh.co.za</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getApplicationApprovedEmail(
  studentName: string,
  courseName: string,
  coursePrice: number,
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    accountType: string;
  },
  paymentInstructionsUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2C3E50; color: white; padding: 30px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #8B7355; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .bank-details { background-color: white; padding: 20px; border-left: 4px solid #2C3E50; margin: 20px 0; }
        .bank-details p { margin: 8px 0; }
        h1 { margin: 0; }
        .highlight { color: #2C3E50; font-weight: bold; }
        .price { font-size: 24px; color: #2C3E50; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Congratulations!</h1>
          <p>Your Application Has Been Approved</p>
        </div>
        <div class="content">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>We are delighted to inform you that your application for the <span class="highlight">${courseName}</span> program has been <strong>approved</strong>!</p>
          
          <h3>Next Steps - Payment Information</h3>
          <p>Course Fee: <span class="price">R ${coursePrice.toLocaleString('en-ZA')}</span></p>
          
          <div class="bank-details">
            <h4>Bank Transfer Details:</h4>
            <p><strong>Bank:</strong> ${bankDetails.bankName}</p>
            <p><strong>Account Name:</strong> ${bankDetails.accountName}</p>
            <p><strong>Account Number:</strong> ${bankDetails.accountNumber}</p>
            <p><strong>Branch Code:</strong> ${bankDetails.branchCode}</p>
            <p><strong>Account Type:</strong> ${bankDetails.accountType}</p>
            <p><strong>Reference:</strong> ${studentName}</p>
          </div>
          
          <p><strong>Important:</strong> After making payment, please upload your proof of payment:</p>
          <a href="${paymentInstructionsUrl}" class="button">Upload Proof of Payment</a>
          
          <p>Once your payment is verified, you will receive your login credentials to access the student portal.</p>
        </div>
        <div class="footer">
          <p><strong>VonWillingh Online</strong></p>
          <p>Email: sarrol@vonwillingh.co.za</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getApplicationRejectedEmail(studentName: string, courseName: string, reason?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc3545; color: white; padding: 30px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        h1 { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Decision</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Thank you for your interest in the <strong>${courseName}</strong> program at VonWillingh Online.</p>
          <p>After careful review of your application, we regret to inform you that we are unable to offer you a place in this program at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>We encourage you to reapply in the future once you meet all the requirements. If you have any questions, please contact our admissions office.</p>
          <p>Thank you for considering VonWillingh Online for your business education journey.</p>
        </div>
        <div class="footer">
          <p><strong>VonWillingh Online</strong></p>
          <p>Email: sarrol@vonwillingh.co.za</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getPaymentVerifiedEmail(
  studentName: string,
  courseName: string,
  studentEmail: string,
  temporaryPassword: string,
  loginUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2C3E50; color: white; padding: 30px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #8B7355; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .credentials { background-color: white; padding: 20px; border-left: 4px solid #2C3E50; margin: 20px 0; font-family: monospace; }
        h1 { margin: 0; }
        .highlight { color: #2C3E50; font-weight: bold; }
        .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Welcome to VonWillingh Online!</h1>
          <p>Payment Verified - Access Granted</p>
        </div>
        <div class="content">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Congratulations! Your payment has been verified and you are now officially enrolled in the <span class="highlight">${courseName}</span> program.</p>
          
          <h3>Your Login Credentials:</h3>
          <div class="credentials">
            <p><strong>Email:</strong> ${studentEmail}</p>
            <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> For security reasons, you will be required to change your password when you first log in.
          </div>
          
          <a href="${loginUrl}" class="button">Login to Student Portal</a>
          
          <h3>What's Next?</h3>
          <ol>
            <li>Click the button above to access the student portal</li>
            <li>Log in with your credentials</li>
            <li>Change your password</li>
            <li>Start your learning journey!</li>
          </ol>
          
          <p>If you encounter any issues, please contact us at sarrol@vonwillingh.co.za</p>
        </div>
        <div class="footer">
          <p><strong>VonWillingh Online</strong></p>
          <p>Email: sarrol@vonwillingh.co.za</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getCourseCompletionEmail(
  studentName: string,
  courseName: string,
  completionDate: string,
  certificateUrl: string,
  dashboardUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2C3E50; color: white; padding: 30px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #8B7355; color: white !important; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .button-secondary { background-color: #2C3E50; }
        h1 { margin: 0; }
        .trophy { font-size: 64px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="trophy">🏆</div>
          <h1>Congratulations!</h1>
          <p>You've Completed Your Course</p>
        </div>
        <div class="content">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>We are thrilled to congratulate you on successfully completing the <strong>${courseName}</strong> program!</p>
          
          <p><strong>Completion Date:</strong> ${new Date(completionDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          
          <p>Your certificate is now ready for download:</p>
          
          <div style="text-align: center;">
            <a href="${certificateUrl}" class="button">📜 Download Certificate</a>
            <a href="${dashboardUrl}" class="button button-secondary">View Dashboard</a>
          </div>
          
          <p>Your hard work and dedication have paid off. We're proud of your achievement and wish you continued success in your career!</p>
          
          <p><strong>Share your success!</strong> Don't forget to share your certificate on LinkedIn and other professional networks.</p>
        </div>
        <div class="footer">
          <p><strong>VonWillingh Online</strong></p>
          <p>Email: sarrol@vonwillingh.co.za</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
