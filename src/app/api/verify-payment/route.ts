import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Reference required" }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Payment not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      return NextResponse.json({ verified: true, data: data.data });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
