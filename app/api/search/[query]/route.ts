import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, props: { params: Promise<{ query: string }>}) => {
  const params = await props.params;
  try {
    await connectToDB()

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: params.query, $options: "i" } },
        { status: { $regex: params.query, $options: "i" } },
        { collections: { $regex: params.query, $options: "i" } },
        { description: { $in: [new RegExp(params.query, "i")] } } // $in is used to match an array of values
      ]
    })

    return NextResponse.json(searchedProducts, { status: 200 })
  } catch (err) {
    console.log("[search_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
