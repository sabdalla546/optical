import React from "react";
import { Resend } from "resend";
import dotenv from "dotenv";
import { render } from "@react-email/render";
import DailyRBACReportEmail from "../emails/DailyRBACReportEmail";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendEmailWithAttachment(
  to: string[],
  subject: string,
  text: string,
  attachmentPath?: string,
  totalChanges?: number
) {
  const html = render(
    React.createElement(DailyRBACReportEmail, {
      totalChanges: totalChanges || 0,
      date: new Date().toLocaleDateString(),
    })
  );

  const attachments =
    attachmentPath && attachmentPath.length > 0
      ? [
          {
            filename: attachmentPath.split("/").pop() || "report.pdf",
            path: attachmentPath,
          },
        ]
      : [];

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@opticalsystem.com",
    to,
    subject,
    html,
    attachments,
  });

  if (error) {
    console.error("❌ Resend email error:", error);
    throw new Error(`Resend email error: ${JSON.stringify(error)}`);
  }

  console.log(`✅ Email sent via Resend to: ${to.join(", ")}`);
  return data;
}
