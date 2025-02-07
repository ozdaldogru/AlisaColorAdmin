import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from '@clerk/nextjs/server';

export const GET = async (req: NextRequest, props: { params: Promise<{ orderId: String }>}) => {
  const params = await props.params;
  try {
    await connectToDB()

    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product
    })

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 })
    }

    const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId})

    return NextResponse.json({ orderDetails, customer }, { status: 200 })
  } catch (err) {
    console.log("[orderId_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
