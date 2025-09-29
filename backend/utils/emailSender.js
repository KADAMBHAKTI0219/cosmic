const nodemailer = require('nodemailer');

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
  
  /**
   * Send a notification email to customers
   * @param {string} to - Recipient email
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} userName - User's name for personalization
   * @returns {Promise} - Email sending result
   */
  const sendNotificationEmail = async (to, title, message, userName) => {
    // Get current date for the email
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const mailOptions = {
      from: `"Cosmic Notifications" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: title,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>${title}</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
            <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url('https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner'); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;">
              <header>
                <table style="width: 100%;">
                  <tbody>
                    <tr style="height: 0;">
                      <td>
                        <img alt="Cosmic Logo" src="https://api.cosmicpowertech.com/uploads/navbar/logo-1758100778637-478532652.png" height="30px" />
                      </td>
                      <td style="text-align: right;">
                        <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${currentDate}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>

              <main>
                <div style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;">
                  <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f;">${title}</h1>
                    <p style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;">Hello ${userName},</p>
                    <p style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">${message}</p>
                  </div>
                </div>
              </main>

              <footer style="margin: 20px auto 0; text-align: center; color: #636363;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f1f1f;">Cosmic</p>
                <p style="margin: 0; margin-top: 8px; font-size: 12px;">© ${new Date().getFullYear()} Cosmic. All rights reserved.</p>
              </footer>
            </div>
          </body>
        </html>
      `
    };
    
    return await transporter.sendMail(mailOptions);
  };

  /**
   * Send an email with OTP for verification
   * @param {string} to - Recipient email
   * @param {string} otp - One-time password
   * @returns {Promise} - Email sending result
   */
  const sendVerificationEmail = async (to, otp) => {
    // Get current date for the email
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    // Get user's first name and last name (for personalization)
    const fullName = to.split('@')[0];
    const nameParts = fullName.split(/[._-]/);
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : '';
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';
    const userName = firstName + (lastName ? ' ' + lastName : '');
    
    const mailOptions = {
      from: `"Cosmic Support" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: 'Email Verification - Cosmic',
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Email Verification</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="
              margin: 0;
              font-family: 'Poppins', sans-serif;
              background: #ffffff;
              font-size: 14px;
            "
          >
            <div
              style="
                max-width: 680px;
                margin: 0 auto;
                padding: 45px 30px 60px;
                background: #f4f7ff;
                background-image: url('https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner');
                background-repeat: no-repeat;
                background-size: 800px 452px;
                background-position: top center;
                font-size: 14px;
                color: #434343;
              "
            >
              <header>
                <table style="width: 100%;">
                  <tbody>
                    <tr style="height: 0;">
                      <td>
                        <img
                          alt="Cosmic Logo"
                          src="https://api.cosmicpowertech.com/uploads/navbar/logo-1758100778637-478532652.png"
                          height="30px"
                        />
                      </td>
                      <td style="text-align: right;">
                        <span
                          style="font-size: 16px; line-height: 30px; color: #ffffff;"
                          >${currentDate}</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>

              <main>
                <div
                  style="
                    margin: 0;
                    margin-top: 70px;
                    padding: 92px 30px 115px;
                    background: #ffffff;
                    border-radius: 30px;
                    text-align: center;
                  "
                >
                  <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1
                      style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 500;
                        color: #1f1f1f;
                      "
                    >
                      Your OTP
                    </h1>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-size: 16px;
                        font-weight: 500;
                      "
                    >
                      Hey ${userName},
                    </p>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-weight: 500;
                        letter-spacing: 0.56px;
                      "
                    >
                      Thank you for choosing Cosmic. Use the following OTP
                      to complete the verification process. OTP is
                      valid for
                      <span style="font-weight: 600; color: #1f1f1f;">1 hour</span>.
                      Do not share this code with others.
                    </p>
                    <p
                      style="
                        margin: 0;
                        margin-top: 60px;
                        font-size: 40px;
                        font-weight: 600;
                        letter-spacing: 25px;
                        color: #ba3d4f;
                      "
                    >
                      ${otp}
                    </p>
                  </div>
                </div>

                <p
                  style="
                    max-width: 400px;
                    margin: 0 auto;
                    margin-top: 90px;
                    text-align: center;
                    font-weight: 500;
                    color: #8c8c8c;
                  "
                >
                  Need help? Ask at
                  <a
                    href="mailto:support@cosmicpowertech.com"
                    style="color: #499fb6; text-decoration: none;"
                    >support@cosmicpowertech.com</a
                  >
                  or visit our
                  <a
                    href=""
                    target="_blank"
                    style="color: #499fb6; text-decoration: none;"
                    >Help Center</a
                  >
                </p>
              </main>

              <footer
                style="
                  width: 100%;
                  max-width: 490px;
                  margin: 20px auto 0;
                  text-align: center;
                  border-top: 1px solid #e6ebf1;
                "
              >
                <p
                  style="
                    margin: 0;
                    margin-top: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #434343;
                  "
                >
                  Cosmic Powertech
                </p>
                <p style="margin: 0; margin-top: 8px; color: #434343;">
                  Cosmic Powertech Online Shopping Platform
                </p>
                <div style="margin: 0; margin-top: 16px;">
                  <a href="https://www.facebook.com/cosmicpowertech" target="_blank" style="display: inline-block;">
                    <img
                      width="36px"
                      alt="Facebook"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/cosmicpowertech"
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="Instagram"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
                  /></a>
                  <a
                    href="https://www.linkedin.com/company/cosmicpowertech"
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="LinkedIn"
                      src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    />
                  </a>
                </div>
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                  Copyright © ${new Date().getFullYear()} Cosmic Powertech. All rights reserved.
                </p>
              </footer>
            </div>
          </body>
        </html>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Send order confirmation email
   * @param {string} to - Recipient email
   * @param {Object} order - Order details
   * @returns {Promise} - Email sending result
   */
  const sendOrderConfirmationEmail = async (to, order) => {
    // Get current date for the email
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    // Get user's first name and last name (for personalization)
    const fullName = to.split('@')[0];
    const nameParts = fullName.split(/[._-]/);
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : '';
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';
    const userName = firstName + (lastName ? ' ' + lastName : '');
    
    // Format order items for email
    const itemsList = order.items.map(item => {
      return `
        <tr style="border-bottom: 1px solid #e6ebf1; transition: background-color 0.2s;">
          <td style="padding: 16px 15px;">
            <div style="display: flex; align-items: center;">
              ${item.productId.images && item.productId.images.length > 0 ? 
                `<img src="${item.productId.images[0]}" alt="${item.productId.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 6px;">` : ''}
              <div style="font-weight: 500; color: #333; font-size: 14px; line-height: 1.4;">
                ${item.productId.name || 'Product'}
                ${item.productId.sku ? `<div style="font-weight: normal; color: #666; font-size: 12px; margin-top: 4px;">SKU: ${item.productId.sku}</div>` : ''}
                ${item.productId.description ? `<div style="font-weight: normal; color: #666; font-size: 12px; margin-top: 4px;">${item.productId.description.substring(0, 60)}${item.productId.description.length > 60 ? '...' : ''}</div>` : ''}
              </div>
            </div>
          </td>
          <td style="padding: 16px 15px; text-align: center; font-size: 14px; color: #333;">${item.quantity}</td>
          <td style="padding: 16px 15px; text-align: right; font-size: 14px; color: #333;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 16px 15px; text-align: right; font-weight: 500; font-size: 14px; color: #333;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    // Calculate expected delivery date (7 days from order date)
    const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const mailOptions = {
      from: `"Cosmic Powertech Orders" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `Order Confirmation - #${order._id}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Order Confirmation</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="
              margin: 0;
              font-family: 'Poppins', sans-serif;
              background: #ffffff;
              font-size: 14px;
            "
          >
            <div
              style="
                max-width: 680px;
                margin: 0 auto;
                padding: 45px 30px 60px;
                background: #f4f7ff;
                background-image: url('https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner');
                background-repeat: no-repeat;
                background-size: 800px 452px;
                background-position: top center;
                font-size: 14px;
                color: #434343;
              "
            >
              <header>
                <table style="width: 100%;">
                  <tbody>
                    <tr style="height: 0;">
                      <td>
                        <img
                          alt="Cosmic Powertech Logo"
                          src="https://api.cosmicpowertech.com/uploads/navbar/logo-1758100778637-478532652.png"
                          height="30px"
                        />
                      </td>
                      <td style="text-align: right;">
                        <span
                          style="font-size: 16px; line-height: 30px; color: #ffffff;"
                          >${currentDate}</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>

              <main>
                <div
                  style="
                    margin: 0;
                    margin-top: 70px;
                    padding: 40px 30px;
                    background: #ffffff;
                    border-radius: 30px;
                  "
                >
                  <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1
                      style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 500;
                        color: #1f1f1f;
                        text-align: center;
                      "
                    >
                      Order Confirmation
                    </h1>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-size: 16px;
                        font-weight: 500;
                        text-align: center;
                      "
                    >
                      Hey ${userName},
                    </p>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-weight: 500;
                        letter-spacing: 0.56px;
                        text-align: center;
                      "
                    >
                      Thank you for your order! We've received your order and will process it shortly.
                    </p>
                    
                    <div style="margin-top: 32px; margin-bottom: 32px; border: 1px solid #e5e5e5; border-radius: 16px; padding: 20px;">
                      <table style="width: 100%;">
                        <tr>
                          <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
                          <td style="padding: 8px 0; text-align: right;">#${order._id}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;"><strong>Order Date:</strong></td>
                          <td style="padding: 8px 0; text-align: right;">${new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;"><strong>Order Status:</strong></td>
                          <td style="padding: 8px 0; text-align: right; color: #2e7d32;">${order.orderStatus}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;"><strong>Payment Status:</strong></td>
                          <td style="padding: 8px 0; text-align: right; color: ${order.paymentStatus === 'paid' ? '#2e7d32' : '#d32f2f'};">${order.paymentStatus}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <h2 style="margin: 0; margin-top: 30px; font-size: 20px; font-weight: 600; color: #1f1f1f; text-align: center;">
                      Order Summary
                    </h2>
                    
                    <div style="width: 100%; overflow-x: auto; margin-top: 24px; border: 1px solid #e6ebf1; border-radius: 8px;">
                      <table style="width: 100%; min-width: 400px; margin: 0 auto; border-collapse: collapse;">
                        <thead>
                          <tr style="background-color: #f8f9fa; border-bottom: 2px solid #e6ebf1;">
                            <th style="padding: 15px; text-align: left; font-size: 15px; color: #444; font-weight: 600;">Product</th>
                            <th style="padding: 15px; text-align: center; font-size: 15px; color: #444; font-weight: 600; width: 60px;">Qty</th>
                            <th style="padding: 15px; text-align: right; font-size: 15px; color: #444; font-weight: 600; width: 100px;">Price</th>
                            <th style="padding: 15px; text-align: right; font-size: 15px; color: #444; font-weight: 600; width: 100px;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsList}
                        </tbody>
                        <tfoot style="background-color: #f8f9fa;">
                          <tr>
                            <td colspan="3" style="padding: 16px 15px; text-align: right; font-weight: 500; border-top: 1px solid #e6ebf1;">Subtotal:</td>
                            <td style="padding: 16px 15px; text-align: right; font-weight: 500; border-top: 1px solid #e6ebf1;">₹${order.totalPrice.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td colspan="3" style="padding: 8px 15px; text-align: right; font-weight: 500;">Shipping:</td>
                            <td style="padding: 8px 15px; text-align: right; font-weight: 500;">₹0.00</td>
                          </tr>
                          <tr>
                            <td colspan="3" style="padding: 16px 15px; text-align: right; font-weight: 600; font-size: 16px; color: #1f1f1f; border-top: 1px solid #e6ebf1;">Total Amount:</td>
                            <td style="padding: 16px 15px; text-align: right; font-weight: 600; font-size: 16px; color: #ba3d4f; border-top: 1px solid #e6ebf1;">₹${order.totalPrice.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                <p
                  style="
                    max-width: 400px;
                    margin: 0 auto;
                    margin-top: 40px;
                    text-align: center;
                    font-weight: 500;
                    color: #8c8c8c;
                  "
                >
                  If you have any questions about your order, please contact our
                  <a
                    href="mailto:support@cosmicpowertech.com"
                    style="color: #499fb6; text-decoration: none;"
                    >customer support team</a
                  >.
                </p>
              </main>

              <footer
                style="
                  width: 100%;
                  max-width: 490px;
                  margin: 20px auto 0;
                  text-align: center;
                  border-top: 1px solid #e6ebf1;
                "
              >
                <p
                  style="
                    margin: 0;
                    margin-top: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #434343;
                  "
                >
                  Cosmic Powertech
                </p>
                <p style="margin: 0; margin-top: 8px; color: #434343;">
                  Cosmic Powertech Online Shopping Platform
                </p>
                <div style="margin: 0; margin-top: 16px;">
                  <a href="https://www.facebook.com/cosmicpowertech" target="_blank" style="display: inline-block;">
                    <img
                      width="36px"
                      alt="Facebook"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/cosmicpowertech"
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="Instagram"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
                  /></a>
                  <a
                    href="https://www.linkedin.com/company/cosmicpowertech"
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="LinkedIn"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504301898_684202/email-template-icon-linkedin"
                    />
                  </a>
                </div>
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                  Copyright © ${new Date().getFullYear()} Cosmic Powertech. All rights reserved.
                </p>
              </footer>
            </div>
          </body>
        </html>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Order confirmation email sending failed:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Send order status update email
   * @param {string} to - Recipient email
   * @param {Object} order - Order details
   * @returns {Promise} - Email sending result
   */
  const sendOrderStatusUpdateEmail = async (to, order) => {
    // Get current date for the email
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    // Get user's first name and last name (for personalization)
    const fullName = to.split('@')[0];
    const nameParts = fullName.split(/[._-]/);
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : '';
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';
    const userName = firstName + (lastName ? ' ' + lastName : '');
    
    // Get status message and color based on order status
    let statusMessage = '';
    let statusColor = '#2e7d32'; // Default green color
    let statusEmoji = '✅';
    let statusTitle = '';
    
    switch (order.orderStatus) {
      case 'confirmed':
        statusTitle = 'Your order has been confirmed';
        statusMessage = 'Your order has been confirmed and is being processed.';
        statusColor = '#2e7d32'; // Green
        statusEmoji = '✅';
        break;
      case 'shipped':
        statusTitle = 'Your order has been shipped';
        statusMessage = 'Great news! Your order has been shipped and is on its way to you.';
        statusColor = '#1976d2'; // Blue
        statusEmoji = '🚚';
        break;
      case 'delivered':
        statusTitle = 'Your order has been delivered';
        statusMessage = 'Your order has been delivered. We hope you enjoy your purchase!';
        statusColor = '#2e7d32'; // Green
        statusEmoji = '📦';
        break;
      case 'cancelled':
        statusTitle = 'Your order has been cancelled';
        statusMessage = 'Your order has been cancelled. If you did not request this cancellation, please contact our support team.';
        statusColor = '#d32f2f'; // Red
        statusEmoji = '❌';
        break;
      default:
        statusTitle = `Order Status: ${order.orderStatus}`;
        statusMessage = 'There has been an update to your order.';
        statusColor = '#ed6c02'; // Orange
        statusEmoji = '📣';
    }
    
    // Format order items for email if needed
    const itemsList = order.items.map(item => {
      return `
        <tr style="border-bottom: 1px solid #e6ebf1; transition: background-color 0.2s;">
          <td style="padding: 16px 15px;">
            <div style="display: flex; align-items: center;">
              ${item.productId.images && item.productId.images.length > 0 ? 
                `<img src="${item.productId.images[0]}" alt="${item.productId.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 6px;">` : ''}
              <div style="font-weight: 500; color: #333; font-size: 14px; line-height: 1.4;">
                ${item.productId.name || 'Product'}
                ${item.productId.sku ? `<div style="font-weight: normal; color: #666; font-size: 12px; margin-top: 4px;">SKU: ${item.productId.sku}</div>` : ''}
                ${item.productId.description ? `<div style="font-weight: normal; color: #666; font-size: 12px; margin-top: 4px;">${item.productId.description.substring(0, 60)}${item.productId.description.length > 60 ? '...' : ''}</div>` : ''}
              </div>
            </div>
          </td>
          <td style="padding: 16px 15px; text-align: center; font-size: 14px; color: #333;">${item.quantity}</td>
          <td style="padding: 16px 15px; text-align: right; font-size: 14px; color: #333;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 16px 15px; text-align: right; font-weight: 500; font-size: 14px; color: #333;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const mailOptions = {
      from: `"Cosmic Powertech Orders" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `Order Status Update - #${order._id}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Order Status Update</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="
              margin: 0;
              font-family: 'Poppins', sans-serif;
              background: #ffffff;
              font-size: 14px;
            "
          >
            <div
              style="
                max-width: 680px;
                margin: 0 auto;
                padding: 45px 30px 60px;
                background: #f4f7ff;
                background-image: url('https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner');
                background-repeat: no-repeat;
                background-size: 800px 452px;
                background-position: top center;
                font-size: 14px;
                color: #434343;
              "
            >
              <header>
                <table style="width: 100%;">
                  <tbody>
                    <tr style="height: 0;">
                      <td>
                        <img
                          alt="Cosmic Powertech Logo"
                          src="https://api.cosmicpowertech.com/uploads/navbar/logo-1758100778637-478532652.png"
                          height="30px"
                        />
                      </td>
                      <td style="text-align: right;">
                        <span
                          style="font-size: 16px; line-height: 30px; color: #ffffff;"
                          >${currentDate}</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>

              <main>
                <div
                  style="
                    margin: 0;
                    margin-top: 70px;
                    padding: 40px 30px;
                    background: #ffffff;
                    border-radius: 30px;
                  "
                >
                  <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1
                      style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 500;
                        color: #1f1f1f;
                        text-align: center;
                      "
                    >
                      Order Status Update ${statusEmoji}
                    </h1>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-size: 16px;
                        font-weight: 500;
                        text-align: center;
                      "
                    >
                      Hey ${userName},
                    </p>
                    
                    <div style="margin-top: 32px; margin-bottom: 32px; border: 1px solid #e5e5e5; border-radius: 16px; padding: 20px;">
                      <table style="width: 100%;">
                        <tr>
                          <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
                          <td style="padding: 8px 0; text-align: right;">#${order._id}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;"><strong>Order Status:</strong></td>
                          <td style="padding: 8px 0; text-align: right; color: ${statusColor}; font-weight: 600;">${order.orderStatus.toUpperCase()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;"><strong>Payment Status:</strong></td>
                          <td style="padding: 8px 0; text-align: right; color: ${order.paymentStatus === 'paid' ? '#2e7d32' : '#d32f2f'};">${order.paymentStatus}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div
                      style="
                        margin-top: 24px;
                        padding: 24px;
                        background-color: #f9f9f9;
                        border-radius: 16px;
                        text-align: center;
                      "
                    >
                      <p style="margin: 0; font-weight: 500; color: ${statusColor};">
                        ${statusMessage}
                      </p>
                    </div>
                    
                    <p
                      style="
                        margin: 24px 0 0;
                        text-align: center;
                        font-weight: 500;
                      "
                    >
                      You can view your order details by logging into your account.
                    </p>
                  </div>
                </div>

                <p
                  style="
                    max-width: 400px;
                    margin: 0 auto;
                    margin-top: 40px;
                    text-align: center;
                    font-weight: 500;
                    color: #8c8c8c;
                  "
                >
                  If you have any questions about your order, please contact our
                  <a
                    href="mailto:support@cosmicpowertech.com"
                    style="color: #499fb6; text-decoration: none;"
                    >customer support team</a
                  >.
                </p>
              </main>

              <footer
                style="
                  width: 100%;
                  max-width: 490px;
                  margin: 20px auto 0;
                  text-align: center;
                  border-top: 1px solid #e6ebf1;
                "
              >
                <p
                  style="
                    margin: 0;
                    margin-top: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #434343;
                  "
                >
                  Cosmic Powertech
                </p>
                <p style="margin: 0; margin-top: 8px; color: #434343;">
                  Cosmic Powertech Online Shopping Platform
                </p>
                <div style="margin: 0; margin-top: 16px;">
                  <a href="https://www.facebook.com/cosmicpowertech" target="_blank" style="display: inline-block;">
                    <img
                      width="36px"
                      alt="Facebook"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/cosmicpowertech"
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="Instagram"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
                  /></a>
                  <a
                    href="https://www.linkedin.com/company/cosmicpowertech"
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="LinkedIn"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504301898_684202/email-template-icon-linkedin"
                    />
                  </a>
                </div>
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                  Copyright © ${new Date().getFullYear()} Cosmic Powertech. All rights reserved.
                </p>
              </footer>
            </div>
          </body>
        </html>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Order status update email sending failed:', error);
      return { success: false, error: error.message };
    }
  };

  module.exports = {
    sendVerificationEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateEmail,
    sendNotificationEmail
  };