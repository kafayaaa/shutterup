import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require("midtrans-client");

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false, // Set ke false untuk Sandbox
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customerDetails, items } = body;

    // Parameter transaksi untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: items, // Daftar barang dari keranjang
      customer_details: {
        first_name: customerDetails.first_name,
        email: customerDetails.email, // Midtrans akan mengirim nota ke sini
        phone: customerDetails.phone,
        billing_address: {
          address: customerDetails.address,
          city: customerDetails.city, // Jika ada
        },
        shipping_address: {
          first_name: customerDetails.first_name,
          phone: customerDetails.phone,
          address: customerDetails.address,
        },
      },
    };

    // Membuat Token Transaksi
    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
