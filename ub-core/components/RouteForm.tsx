'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/types';
import CodeEditor from './CodeEditor';
import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

export default function RouteForm({ initialData }: { initialData?: Route }) {
  const [name, setName] = useState(initialData?.name || '');
  const [service, setService] = useState(initialData?.service || '');
  const [route, setRoute] = useState(initialData?.route || '');
  const [method, setMethod] = useState<Route['method']>(initialData?.method || 'GET');
  const [dependencies, setDependencies] = useState(initialData?.dependencies || '');
  const [definition, setDefinition] = useState(initialData?.definition || '');
  const [isActive, setIsActive] = useState(initialData?.isActive || false);
  const [loading, setLoading] = useState(false);

  const [allServices, setAllServices] = useState<RecordModel[]>([]);
  const router = useRouter();

  const fetchServices = async () => {
    try {
      const records = await pb.collection('services').getFullList({ sort: 'name', requestKey: null, });
      setAllServices(records);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<Route, 'id'> = {
      name,
      service,
      route,
      method,
      dependencies,
      definition,
      isActive
    };

    try {
      if (initialData?.id) {
        await pb.collection('routes').update(initialData.id, payload);
      } else {
        await pb.collection('routes').create(payload);
      }

      router.push('/routes');
      router.refresh();
    } catch (err) {
      console.error('Failed to save route:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices()
  })

  return (
    <div className="w-full mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Name
            </label>
            <select
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              {allServices.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Route Name
            </label>
            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. UserService"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Route
            </label>
            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              required
              placeholder="/users"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Method
            </label>
            <select
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={method}
              onChange={(e) => setMethod(e.target.value as Route['method'])}
              required
            >
              {httpMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dependencies (Node.js)
          </label>
          <div className="rounded-lg border border-gray-300 overflow-hidden">
            <CodeEditor
              language="javascript"
              value={dependencies}
              onChange={setDependencies}
              height="200px"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Definition (Node.js)
          </label>
          <div className="rounded-lg border border-gray-300 overflow-hidden">
            <CodeEditor
              language="javascript"
              value={definition}
              onChange={setDefinition}
              height="300px"
            />
          </div>
          
            <div className="w-full flex flex-col gap-3 my-2">
                <span className="text-sm font-medium text-gray-700">Activate</span>
                <div
                    onClick={() => setIsActive(!isActive)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors
                    ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform
                        ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            {loading
              ? 'Saving...'
              : initialData?.id
              ? 'Update Route'
              : 'Create Route'}
          </button>
        </div>
      </form>
    </div>
  );
}
