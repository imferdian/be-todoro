
interface VerificationEmailProps {
  userName: string;
  verificationLink: string;
  expiresIn: string;
}

export const generateVerificationEmail = ({
  userName,
  verificationLink,
  expiresIn
}: VerificationEmailProps): string => {
  const appName = process.env.APP_NAME || 'Todoro';
  
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email - ${appName}</title>
  </head>
  <body style="
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f5;
  ">
    <table role="presentation" cellspacing="0" cellpadding="0" style="
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    ">
      <!-- Header -->
      <tr>
        <td style="
          background: black;
          padding: 32px;
          text-align: center;
        ">
          <h1 style="
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          ">${appName}</h1>
        </td>
      </tr>
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px 32px;">
          <h2 style="
            color: #1f2937;
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
          ">Halo, ${userName}! 👋</h2>
          
          <p style="
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 24px 0;
          ">
            Terima kasih telah mendaftar di ${appName}. Untuk melanjutkan, 
            silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini.
          </p>
          
          <!-- CTA Button -->
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
            <tr>
              <td style="border-radius: 8px; background: black;">
                <a href="${verificationLink}" target="_blank" style="
                  display: inline-block;
                  padding: 16px 32px;
                  color: #ffffff;
                  text-decoration: none;
                  font-size: 16px;
                  font-weight: 600;
                  border-radius: 8px;
                ">
                  ✉️ Verifikasi Email Saya
                </a>
              </td>
            </tr>
          </table>
          
          <p style="
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
            margin: 24px 0 0 0;
          ">
            Atau copy dan paste link berikut ke browser Anda:
          </p>
          <p style="
            color: #6366f1;
            font-size: 14px;
            word-break: break-all;
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
            margin: 8px 0 0 0;
          ">${verificationLink}</p>
          
          <!-- Warning -->
          <div style="
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin-top: 24px;
            border-radius: 0 8px 8px 0;
          ">
            <p style="
              color: #92400e;
              font-size: 14px;
              margin: 0;
            ">
              ⚠️ Link ini akan kadaluarsa dalam <strong>${expiresIn}</strong>. 
              Jika Anda tidak mendaftar di ${appName}, abaikan email ini.
            </p>
          </div>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="
          background-color: #f9fafb;
          padding: 24px 32px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        ">
          <p style="
            color: #9ca3af;
            font-size: 12px;
            margin: 0;
          ">
            © ${new Date().getFullYear()} ${appName}. All rights reserved.
          </p>
          <p style="
            color: #9ca3af;
            font-size: 12px;
            margin: 8px 0 0 0;
          ">
            Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `.trim();
  
}

export const generateVerificationEmailText = ({ 
  userName,
  verificationLink,
  expiresIn
}: VerificationEmailProps ): string => {
  const appName = process.env.APP_NAME || 'Todoro';
  
  return `
  Halo, ${userName}!
  
  Terima kasih telah mendaftar di ${appName}
  Untuk melanjutkan, silahkan verifikasi akamat email Anda dengan mengklik link berikut:
  
  ${verificationLink}
  
  Link ini akan kadaluarsa dalam ${expiresIn}.
  
  Jika anda tidak mendaftar di ${appName}, abaikan email ini.
  
  ---
  © ${new Date().getFullYear()} ${appName}. All rights reserved.  
  `.trim();
}