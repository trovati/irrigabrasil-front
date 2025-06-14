// app/orders/new/page.tsx
"use client";

import OrderForm from "@/components/OrderForm";

export default function NewOrderPage() {
  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 p-2">IRRIGABRASIL LTDA</h1>
      <OrderForm />
    </main>
  );
}
