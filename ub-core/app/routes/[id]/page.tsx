// app/routes/[id]/page.tsx
'use client';
import pb from '@/lib/pocketbase';
import RouteForm from '@/components/RouteForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ViewEditRoutePage() {
    const params = useParams();
    const [route, setRoute] = useState<any>(null);
    
    useEffect(() => {
      const fetchRoute = async () => {
        const id = params?.id as string;
        if (!id) return;
        const data = await pb.collection('routes').getOne(id, { requestKey: null });
        setRoute(data);
      };

      fetchRoute();
    }, [params]);

    if (!route) return <p className="p-6">Loading...</p>;
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Edit Route</h1>
        <RouteForm initialData={route} />
      </div>
    );
}
