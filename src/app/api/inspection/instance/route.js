import { connectToDb } from '@/lib/db';
import Instance from '@/models/instance-collection';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("nameLike");
    const resource = searchParams.get("resourceLike");
    const service = searchParams.get("serviceLike");
    const status = searchParams.get("statusIn");

    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const skip = page * size;

    await connectToDb();
    const filter = {};

    if (name) {
      const regex = new RegExp(name, 'i');
      filter.name = { $regex: regex };
    }

    if (resource) {
      const regex = new RegExp(resource, 'i');
      filter.resource = { $regex: regex };
    }

    if (service) {
      const regex = new RegExp(service, 'i');
      filter.service = { $regex: regex };
    }

    if (status) {
      const parsedStatus = JSON.parse(status);
      if (Array.isArray(parsedStatus) && parsedStatus.length > 0) {
        filter.status = { $in: parsedStatus };
      }
    }

    const instances = await Instance
      .find(filter, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)

    const totalElements = await Instance.countDocuments();
    const totalPages = Math.ceil(totalElements / size);
    const numberOfElements = instances.length;
    const offset = (page + 1) * size;
    const unpaged = totalPages === 0 ? true : false;
    const paged = totalPages > 0 ? true : false;

    return NextResponse.json(
      {
        success: true,
        message: "Success get instance collection",
        data: {
          content: instances,
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

    const newInstance = new Instance(body);
    await newInstance.save({}, { _id: 0, __v: 0 });

    return NextResponse.json(
      {
        success: true,
        message: "Success create instance",
        data: newInstance
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