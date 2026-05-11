import nodemailer from 'nodemailer';

const configured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = configured
  ? nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   parseInt(process.env.SMTP_PORT ?? '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

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

export async function sendReplyEmail(opts: ReplyEmailOptions): Promise<void> {
  if (!transporter) {
    console.warn('[mailer] SMTP not configured — reply saved to DB but email skipped');
    return;
  }

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

  await transporter.sendMail({
    from:    FROM,
    to:      opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to,
    replyTo: `"${opts.agentName}" <${opts.agentEmail}>`,
    subject,
    text,
  });
}
