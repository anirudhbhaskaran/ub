import DeleteProcedureButton from '@/components/DeleteProcedureButton';
import pb from '@/lib/pocketbase';
import { Procedure } from '@/types';
import Link from 'next/link';

export default async function ProceduresPage() {
  const records = await pb.collection('procedures').getFullList<Procedure>({
    sort: '-created',
  });
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Procedures</h1>
        <Link
          href="/procedures/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
        >
          + Add Procedure
        </Link>
      </div>

        {records.length === 0 ? (<p className="text-gray-500">No procedures found.</p>) : 
        
        <div className="grid gap-4">
          {records.map((proc) => (
            <div key={proc.id} className="inline-flex w-full items-center justify-between p-4 bg-white drop-shadow-2xl my-2 rounded">
              <h2 className="text-xl font-semibold">{proc.name}</h2>
              <div className="inline-flex items-center justify-between">
                <Link href={`/procedures/${proc.id}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium mx-2">Edit</Link>
                
                <DeleteProcedureButton id={proc.id!} />
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
