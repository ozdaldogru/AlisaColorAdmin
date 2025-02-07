import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";


export const GET = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
  const params = await props.params;
  try {
    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("[productId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
  const params = await props.params;
  try {
    const  userId = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const { title, status, description, media, collections, price, expense } = await req.json();

    if (!title || !status || !description || !media || !collections || !price || !expense) {
      return new NextResponse("Please fill up all fields", { status: 400 });
    }

    product = await Product.findByIdAndUpdate(
      params.productId,
      { title, status, description, media, collections, price, expense },
      { new: true }
    );

    await product.save();

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, props: { params: Promise<{ productId: string }> }) => {
  const params = await props.params;
  try {
    const userId  = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Product.findByIdAndDelete(params.productId);
   
    return new NextResponse("Product is deleted", { status: 200 });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
