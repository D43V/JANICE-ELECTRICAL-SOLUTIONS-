import { Resend } from 'resend'
const resend=new Resend(process.env.RESEND_API_KEY)
export async function sendQuotationNotification(input:{to:string;subject:string;html:string;pdf?:Uint8Array}){if(!process.env.RESEND_API_KEY||!process.env.EMAIL_FROM)throw new Error('Email service is not configured');return resend.emails.send({from:process.env.EMAIL_FROM,to:input.to,subject:input.subject,html:input.html,attachments:input.pdf?[{filename:'quotation.pdf',content:Buffer.from(input.pdf)}]:undefined})}
