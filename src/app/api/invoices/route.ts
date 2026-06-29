import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const userId = session?.user ? (session.user as { id: string }).id : null;

    let clientId = null;

    if (userId && body.clientName && body.clientEmail) {
      let client = await prisma.client.findFirst({
        where: { userId, email: body.clientEmail },
      });

      if (!client) {
        client = await prisma.client.create({
          data: {
            name: body.clientName,
            email: body.clientEmail,
            userId,
          },
        });
      }

      clientId = client.id;
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: body.invoiceNumber,
        userId,
        clientId,
        businessName: body.businessName,
        businessEmail: body.businessEmail,
        businessPhone: body.businessPhone,
        logoUrl: body.logoUrl || null,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        invoiceDate: body.invoiceDate,
        dueDate: body.dueDate,
        currency: body.currency,
        taxPercent: body.taxPercent || 0,
        discountPercent: body.discountPercent || 0,
        notes: body.notes || null,
        paymentTerms: body.paymentTerms || null,
        items: JSON.stringify(body.items),
        subtotal: body.subtotal,
        taxAmount: body.taxAmount || 0,
        discountAmount: body.discountAmount || 0,
        total: body.total,
        paid: true,
        paymentRef: body.paymentRef || null,
      },
    });

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json(
      { error: "Failed to save invoice" },
      { status: 500 }
    );
  }
}
