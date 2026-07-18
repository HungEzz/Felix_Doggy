import { env } from './env';

async function sendResendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[RESEND] API Key is not configured. Falling back to console logging.');
    console.log(`
========================================================================
[RESEND MOCK]
- To: ${to}
- Subject: ${subject}
========================================================================
    `);
    return;
  }

  const from = env.RESEND_FROM || 'onboarding@resend.dev';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Felix Doggy <${from}>`,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
}

/**
 * Send OTP verification email with a styled HTML template.
 * The OTP code is displayed prominently in the email body.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#141414;border-radius:16px;border:1px solid #222;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1db954 0%,#148a3c 100%);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#000;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
        🐶 Felix Doggy
      </h1>
      <p style="margin:8px 0 0;color:rgba(0,0,0,0.7);font-size:13px;">
        Account Verification
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <p style="color:#e0e0e0;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Hello! You have just registered an account at <strong style="color:#1db954;">Felix Doggy</strong>.
        Please use the OTP code below to verify your email:
      </p>

      <!-- OTP Code -->
      <div style="background:#1a1a1a;border:2px dashed #1db954;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
        <p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">
          Verification Code
        </p>
        <p style="margin:0;color:#1db954;font-size:36px;font-weight:800;letter-spacing:8px;font-family:'Courier New',monospace;">
          ${otp}
        </p>
      </div>

      <p style="color:#888;font-size:12px;line-height:1.5;margin:20px 0 0;">
        ⏱ The code is valid for <strong style="color:#e0e0e0;">5 minutes</strong>.<br>
        🔒 Do not share this code with anyone.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 28px;border-top:1px solid #222;text-align:center;">
      <p style="margin:0;color:#555;font-size:11px;">
        If you did not request registration, please ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await sendResendEmail(to, `[Felix Doggy] OTP Verification Code: ${otp}`, html);
  } catch (error: any) {
    console.error('Failed to send OTP email via Resend:', error.message || error);
    console.log(`
========================================================================
[MAIL FALLBACK] EMAIL SEND FAILURE DETECTED
- Recipient email: ${to}
- Your OTP code: ${otp}
Please use this OTP code to complete the verification on the web UI.
========================================================================
    `);
  }
}

/**
 * Send OTP email for password reset with a styled HTML template.
 */
export async function sendPasswordResetOtpEmail(to: string, otp: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#141414;border-radius:16px;border:1px solid #222;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#e74c3c 0%,#c0392b 100%);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
        🔑 Felix Doggy
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
        Reset Password
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <p style="color:#e0e0e0;font-size:14px;line-height:1.6;margin:0 0 20px;">
        You have requested to reset your password for your account at <strong style="color:#e74c3c;">Felix Doggy</strong>.
        Please use the OTP code below to confirm:
      </p>

      <!-- OTP Code -->
      <div style="background:#1a1a1a;border:2px dashed #e74c3c;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
        <p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">
          Confirmation Code
        </p>
        <p style="margin:0;color:#e74c3c;font-size:36px;font-weight:800;letter-spacing:8px;font-family:'Courier New',monospace;">
          ${otp}
        </p>
      </div>

      <p style="color:#888;font-size:12px;line-height:1.5;margin:20px 0 0;">
        ⏱ The code is valid for <strong style="color:#e0e0e0;">5 minutes</strong>.<br>
        🔒 Do not share this code with anyone.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 28px;border-top:1px solid #222;text-align:center;">
      <p style="margin:0;color:#555;font-size:11px;">
        If you did not request a password reset, please ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await sendResendEmail(to, `[Felix Doggy] Password Reset Code`, html);
  } catch (error: any) {
    console.error('Failed to send password reset email via Resend:', error.message || error);
    console.log(`
========================================================================
[MAIL FALLBACK] EMAIL SEND FAILURE DETECTED
- Recipient email: ${to}
- Password reset OTP code: ${otp}
Please use this OTP code to complete your password reset.
========================================================================
    `);
  }
}

/**
 * Send order confirmation email to the buyer with order details and tracking link.
 */
export async function sendOrderConfirmationEmail(to: string, order: any): Promise<void> {
  const displayId = order.orderCode || order.id.split('-')[0].toUpperCase();
  const trackingUrl = `${env.FRONTEND_URL}/order-tracking/${displayId}`;
  
  const itemsHtml = order.orderItems?.map((oi: any) => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 8px; color: #e0e0e0;">${oi.product?.title || `Product #${oi.productId}`}</td>
      <td style="padding: 12px 8px; color: #888; text-align: center;">x${oi.quantity}</td>
      <td style="padding: 12px 8px; color: #1db954; text-align: right;">$${(oi.priceAtTime * oi.quantity).toFixed(2)}</td>
    </tr>
  `).join('') || '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:540px;margin:40px auto;background:#141414;border-radius:16px;border:1px solid #222;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1db954 0%,#148a3c 100%);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#000;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
        🛒 Felix Doggy
      </h1>
      <p style="margin:8px 0 0;color:rgba(0,0,0,0.7);font-size:13px;text-transform:uppercase;font-weight:bold;letter-spacing:1px;">
        Order Confirmed!
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <p style="color:#e0e0e0;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Thank you for your purchase! We've received your order and are getting it ready.
      </p>

      <!-- Order Details Card -->
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 12px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">
          Order Reference
        </p>
        <p style="margin:0 0 16px;color:#1db954;font-size:24px;font-weight:800;font-family:'Courier New',monospace;">
          #${displayId}
        </p>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 2px solid #333; text-align: left;">
              <th style="padding: 8px; color: #888;">Item</th>
              <th style="padding: 8px; color: #888; text-align: center;">Qty</th>
              <th style="padding: 8px; color: #888; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 16px 8px 8px; color: #888; font-weight: bold;">Total Amount</td>
              <td style="padding: 16px 8px 8px; color: #1db954; font-size: 16px; font-weight: 800; text-align: right;">$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${trackingUrl}" style="background:#1db954;color:#000;text-decoration:none;padding:14px 28px;font-size:14px;font-weight:bold;border-radius:30px;display:inline-block;letter-spacing:0.5px;">
          Track My Order
        </a>
      </div>

      <p style="color:#888;font-size:12px;line-height:1.5;margin:20px 0 0;text-align:center;">
        Questions? Contact our support or check the tracking link above.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 28px;border-top:1px solid #222;text-align:center;background:#0d0d0d;">
      <p style="margin:0;color:#555;font-size:11px;">
        © Felix Doggy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await sendResendEmail(to, `[Felix Doggy] Order Confirmation #${displayId}`, html);
  } catch (error: any) {
    console.error('Failed to send order confirmation email via Resend:', error.message || error);
    console.log(`
========================================================================
[MAIL FALLBACK] ORDER CONFIRMATION SEND FAILURE
- Recipient email: ${to}
- Order Reference: #${displayId}
- Total Amount: $${order.totalAmount.toFixed(2)}
- Tracking URL: ${trackingUrl}
========================================================================
    `);
  }
}
