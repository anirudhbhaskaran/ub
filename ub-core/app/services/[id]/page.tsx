// app/services/[id]/page.tsx
'use client';
import pb from '@/lib/pocketbase';
import ServiceForm from '@/components/ServiceForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ViewEditServicePage() {
    const params = useParams();
    const [service, setService] = useState<any>(null);
    
    useEffect(() => {
      const fetchService = async () => {
        const id = params?.id as string;
        if (!id) return;
        const data = await pb.collection('services').getOne(id, { requestKey: null });
        setService(data);
      };

      fetchService();
    }, [params]);

    if (!service) return <p className="p-6">Loading...</p>;
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Edit Service</h1>
        <ServiceForm initialData={service} />
      </div>
    );
}
