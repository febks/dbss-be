import connectToDb from '@/lib/db';
import InstanceStep from "@/models/instance-step-models";
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { instanceCode } = params;
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const skip = page * size;

    await connectToDb();
    // const filter = {};

    const instanceSteps = await InstanceStep
      .find({ instanceCode: instanceCode }, { _id: 0, __v: 0, instanceCode: "" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)

    const totalElements = await InstanceStep.countDocuments({ instanceCode: instanceCode });
    const totalPages = Math.ceil(totalElements / size);
    const numberOfElements = instanceSteps.length;
    const offset = (page + 1) * size;
    const unpaged = totalPages === 0 ? true : false;
    const paged = totalPages > 0 ? true : false;

    return NextResponse.json(
      {
        success: true,
        message: "Success get instance step",
        data: {
          content: instanceSteps,
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
        message: "error: " + error.message,
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

    const newInstanceStep = new InstanceStep(body);
    await newInstanceStep.save({}, { instanceCode: "" });

    return NextResponse.json(
      {
        success: true,
        message: "Success create instance step",
        data: newOrder
      },
      { status: 201 }
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