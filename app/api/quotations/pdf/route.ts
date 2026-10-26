import { NextResponse } from 'next/server'
import { createQuotationPdf } from '@/lib/quotation-pdf'
export async function POST(request:Request){try{const body=await request.json();if(!body?.reference||!body?.customer||!Array.isArray(body.items))return NextResponse.json({error:'Invalid quotation payload'},{status:400});const pdf=await createQuotationPdf(body);return new NextResponse(Buffer.from(pdf),{headers:{'content-type':'application/pdf','content-disposition':`attachment; filename="${body.reference}.pdf"`}})}catch{return NextResponse.json({error:'Unable to generate PDF'},{status:500})}}
