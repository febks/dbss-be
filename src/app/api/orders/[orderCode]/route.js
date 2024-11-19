import connectToDb from '@/lib/db';
import Order from '@/models/order-collection-models';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { orderCode } = params;

    await connectToDb();
    const order = await Order.findOne({ code: orderCode, _id: 0, __v: 0 });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
          data: {}
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      {
        success: true,
        message: "Success get order",
        data: order
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "error: " + error.message,
        data: {}
      },
      { status: 500 }
    )
  }
}
