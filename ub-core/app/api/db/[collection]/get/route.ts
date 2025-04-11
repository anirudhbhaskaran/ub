import { NextRequest, NextResponse } from 'next/server'
import pb from '@/lib/pocketbase'

export async function POST(req: NextRequest, context: any) {
  const { collection } = context?.params
  const validCollections = ['services', 'procedures', 'routes']

  if (!validCollections.includes(collection)) {
    return NextResponse.json({ message: 'Invalid collection' }, { status: 400 })
  }

  try {
    const data = await req.json()
    const record = await pb.collection(collection).getFullList({ sort: data.sort || '-created', requestKey: null, });

    return NextResponse.json(record)
  } catch (error: any) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { message: error.message || 'Something went wrong.' },
      { status: error.status || 500 }
    )
  }
}
