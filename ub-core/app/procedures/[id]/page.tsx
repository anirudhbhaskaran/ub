'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import pb from '@/lib/pocketbase';
import ProcedureForm from '@/components/ProcedureForm';

export default function EditProcedurePage() {
  const params = useParams();
  const [procedure, setProcedure] = useState<any>(null);

  useEffect(() => {
    const fetchProcedure = async () => {
      const id = params?.id as string;
      if (!id) return;
      const data = await pb.collection('procedures').getOne(id, { requestKey: null });
      setProcedure(data);
    };

    fetchProcedure();
  }, [params]);

  if (!procedure) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Procedure</h1>
      <ProcedureForm initialData={procedure} />
    </div>
  );
}
