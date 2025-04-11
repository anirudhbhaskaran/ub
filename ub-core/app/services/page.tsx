// app/services/page.tsx
import pb from '@/lib/pocketbase';
import Link from 'next/link';
import { Service } from '@/types';
import DeleteServiceButton from '@/components/DeleteServiceButton';


export default async function ServicesPage() {
  const records = await pb.collection('services').getFullList<Service>({
    sort: '-created',
  });

  return (
    <div className="w-full px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Services</h1>
        <Link
          href="/services/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
        >
          + Add Service
        </Link>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500">No services found.</p>
      ) : (
        <div className="w-full grid grid-cols-1">
          {records.map((service) => (
            <div className="inline-flex w-full items-center justify-between p-4 bg-white drop-shadow-2xl my-2 rounded" key={service.id}>
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <div className='inline-flex items-center justify-between'>
                <Link
                  href={`/services/${service.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium mx-2"
                >
                  Edit
                </Link>
                <DeleteServiceButton id={service.id!} />
              </div>
            </div>
          
          ))}
        </div>
      )}
    </div>
  );
}
