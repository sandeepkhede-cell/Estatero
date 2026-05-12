import nodemailer from 'nodemailer';

const configured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter: nodemailer.Transporter | null = configured
  ? nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   parseInt(process.env.SMTP_PORT ?? '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

async function getTransporter() {
  if (transporter) return transporter;
  console.log('[mailer] SMTP not configured. Creating Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log('[mailer] Ethereal test account created.');
  return transporter;
}

const FROM = process.env.SMTP_FROM ?? 'Estatero <noreply@estatero.in>';

export interface ReplyEmailOptions {
  to:              string;
  toName:          string | null;
  agentName:       string;
  agentEmail:      string;
  propertyTitle:   string | null;
  originalMessage: string;
  replyMessage:    string;
}

export interface PasswordResetEmailOptions {
  to:        string;
  toName:    string | null;
  resetLink: string;
}

export async function sendPasswordResetEmail(opts: PasswordResetEmailOptions): Promise<void> {
  const t = await getTransporter();

  const text = [
    `Hi ${opts.toName ?? 'there'},`,
    '',
    'We received a request to reset your Estatero password.',
    '',
    'Click the link below to set a new password (valid for 1 hour):',
    opts.resetLink,
    '',
    'If you did not request this, ignore this email — your password will not change.',
    '',
    '— The Estatero Team',
  ].join('\n');

  const info = await t.sendMail({
    from:    FROM,
    to:      opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to,
    subject: 'Reset your Estatero password',
    text,
  });

  if (!configured) {
    console.log('[mailer] Password reset email preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

export async function sendReplyEmail(opts: ReplyEmailOptions): Promise<void> {
  const t = await getTransporter();

  const subject = opts.propertyTitle
    ? `Re: Your enquiry about "${opts.propertyTitle}"`
    : 'Re: Your property enquiry on Estatero';

  const text = [
    `Hi ${opts.toName ?? 'there'},`,
    '',
    `${opts.agentName} has replied to your enquiry:`,
    '',
    opts.replyMessage,
    '',
    '─'.repeat(40),
    'Your original message:',
    opts.originalMessage,
    '',
    `You can reply directly to this email or contact ${opts.agentName} at ${opts.agentEmail}.`,
    '',
    '— The Estatero Team',
  ].join('\n');

  const info = await t.sendMail({
    from:    FROM,
    to:      opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to,
    replyTo: `"${opts.agentName}" <${opts.agentEmail}>`,
    subject,
    text,
  });

  if (!configured) {
    console.log('[mailer] Reply email preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
