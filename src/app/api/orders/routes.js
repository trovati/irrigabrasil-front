// app/api/orders/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    // Aqui você faria algo como:
    // await prisma.order.create({ data: body });

    console.log("Pedido recebido:", body);

    return NextResponse.json({ success: true });
}
