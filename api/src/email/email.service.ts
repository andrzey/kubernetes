import { Resend } from "resend";

const resend = new Resend(process.env.RSEND_API_KEY); // TODO: Add a secret to cluster

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

type SendVerificationEmailInput = {
  to: string;
  token: string;
};

export class EmailService {
  async sendVerificationEmail(input: SendVerificationEmailInput) {
    const { to, token } = input;
    if (!to || !token) {
      throw new Error("to and token are required");
    }
    const apiPrefix = process.env.NODE_ENV === "production" ? "/api" : "";
    const verifyUrl = `${process.env.BETTER_AUTH_URL}${apiPrefix}/auth/verify-email?token=${token}`;

    const html = `
        <div style="font-family: sans-serif; color: #111;">
          <h2>Verify your email address</h2>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <p style="margin: 32px 0;">
            <a href="${verifyUrl}" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;font-size:16px;">Verify Email</a>
          </p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        </div>
      `;

    return this.sendEmail({
      to,
      subject: "Verify your email address",
      html,
      from: "onboarding@resend.dev",
    });
  }

  private async sendEmail(input: SendEmailInput) {
    const { to, subject, html, from } = input;
    if (!to || !subject || !html) {
      throw new Error("to, subject, and html are required");
    }

    return resend.emails.send({
      to,
      subject,
      html,
      from: from || "noreply@yourdomain.com",
    });
  }
}

export const emailService = new EmailService();
