import { Resend } from 'resend';

let resendInstance: Resend | null = null;

export const getResendClient = (): Resend => {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
};

export const emailConfig = {
  from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  replyTo: process.env.EMAIL_REPLY_TO || 'onboarding@resend.dev',
};
