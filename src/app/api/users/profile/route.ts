import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      businessName: true,
      businessEmail: true,
      businessPhone: true,
      logoUrl: true,
      colors: true,
      footer: true,
    },
  });

  return NextResponse.json(user || {});
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      businessName: body.businessName || null,
      businessEmail: body.businessEmail || null,
      businessPhone: body.businessPhone || null,
      logoUrl: body.logoUrl || null,
      colors: body.colors || null,
      footer: body.footer || null,
    },
  });

  return NextResponse.json({ success: true });
}
