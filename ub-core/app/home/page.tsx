'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';

export default function HomePage() {
  const [services, setServices] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [servicesRes, proceduresRes] = await Promise.all([
        pb.collection('services').getFullList({ requestKey: null }),
        pb.collection('procedures').getFullList({ requestKey: null }),
      ]);
      setServices(servicesRes);
      setProcedures(proceduresRes);
    };

    fetchData();
  }, []);

  const renderStatus = (isActive: boolean) =>
    isActive ? <span className="text-green-600 font-bold">🟢</span> : <span className="text-red-600 font-bold">🔴</span>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">System Overview</h1>

      {/* Services Table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <div className="overflow-auto rounded border border-gray-200">
        {services.length === 0 ? <p className="text-gray-500">No services found.</p> : 
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{renderStatus(s.status ?? false)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        </div>
      </div>

      {/* Procedures Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Procedures</h2>
        <div className="overflow-auto rounded border border-gray-200">
        {procedures.length === 0 ? <p className="text-gray-500">No procedures found.</p> : 
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {procedures.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{renderStatus(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        </div>
      </div>
    </div>
  );
}
