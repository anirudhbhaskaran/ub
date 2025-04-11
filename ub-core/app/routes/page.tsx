// app/routes/page.tsx
'use client';

import Link from 'next/link';
import DeleteRouteButton from '@/components/DeleteRouteButton';
import { useEffect, useState } from 'react';


export default function RoutesPage() {

  const [records, setRecords] = useState<Array<any>>([])
  useEffect(() => {
    const getRecords = async function() {
      try {
        const resp = await fetch(`/api/db/routes/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
        const r = await resp.json()
        setRecords(r)
        // records = await pb.collection('routes').getFullList<Procedure>({
        //   sort: '-created',
        // });
      } catch(e) {
        console.log(e)
      }
    }
    getRecords()
  })

  return (
    <div className="w-full px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Routes</h1>
        <Link
          href="/routes/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
        >
          + Add Route
        </Link>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500">No routes found.</p>
      ) : (
        <div className="w-full grid grid-cols-1">
          {records.map((route) => (
            <div className="inline-flex w-full items-center justify-between p-4 bg-white drop-shadow-2xl my-2 rounded" key={route.id}>
              <h2 className="text-xl font-semibold">{route.name}</h2>
              <div className='inline-flex items-center justify-between'>
                <Link
                  href={`/routes/${route.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium mx-2"
                >
                  Edit
                </Link>
                <DeleteRouteButton id={route.id!} />
              </div>
            </div>
          
          ))}
        </div>
      )}
    </div>
  );
}
