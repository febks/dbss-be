import connectToDb from "@/lib/db";
import Order from "@/models/order-collection-models";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("statusIn");
    const itemCode = searchParams.get("itemCodeIn");

    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const skip = page * size;

    await connectToDb();
    const filter = {};

    if (status) {
      const parsedStatus = JSON.parse(status);
      if (Array.isArray(parsedStatus) && parsedStatus.length > 0) {
        filter.status = { $in: parsedStatus };
      }
    }

    if (itemCode) {
      const parsedItemCodes = JSON.parse(itemCode);
      if (Array.isArray(parsedItemCodes) && parsedItemCodes.length > 0) {
        filter['item.code'] = { $in: parsedItemCodes };
      }
    }

    const orders = await Order.find(filter, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
    
    const totalElements = await Order.countDocuments(filter, { _id: 0, __v: 0 });
    const totalPages = Math.ceil(totalElements / size);
    const numberOfElements = orders.length;
    const offset = (page + 1) * size;
    const unpaged = totalPages === 0 ? true : false;
    const paged = totalPages > 0 ? true : false;

    return NextResponse.json(
      {
        success: true,
        message: "Success get order",
        data: {
          content: orders,
          pageable: {
            pageNumber: page,
            pageSize: size,
            offset: offset,
            unpaged: unpaged,
            paged: paged,
            sort: {
              empty: true,
              sorted: true,
              unsorted: false
            }
          },
          first: page === 0 ? true : false,
          last: page === totalPages - 1 || numberOfElements === 0 ? true : false,
          totalPages: totalPages,
          totalElements: totalElements,
          size: size,
          number: page,
          numberOfElements: numberOfElements,
          empty: totalElements === 0 ? true : false,
          sort: {
            empty: true,
            unsorted: false,
            sorted: true
          }
        }
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "error" + error.message,
        data: {}
      },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectToDb();

    const newOrder = new Order(body);
    await newOrder.save({}, { _id: 0, __v: 0 });

    return NextResponse.json(
      {
        success: true,
        message: "Success create order",
        data: newOrder
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "error" + error.message,
        data: {}
      },
      { status: 500 }
    )
  }
}