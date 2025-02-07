import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await connectToDB()

    const { title, status, description, media, collections, price, expense } = await req.json()

    const existingProduct = await Product.findOne({ title })

    if (existingProduct) {
      return new NextResponse("Product is already exists", { status: 400 })
    }

    if (!title || !status || !description || !media || !collections || !price || !expense) {
      return new NextResponse("Please fill up all fields", { status: 400 })
    }

    const newProduct = await Product.create({
      title, status, description, media, collections, price, expense 
    })

    await newProduct.save()

    return NextResponse.json(newProduct, { status: 200 })
  } catch (err) {
    console.log("[products_POST]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const products = await Product.find().sort({ createdAt: "desc" })

    return NextResponse.json(products, { status: 200 })
  } catch (err) {
    console.log("[products_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
