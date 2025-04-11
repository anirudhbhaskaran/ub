'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '@/types';
import CodeEditor from './CodeEditor';
import pb from '@/lib/pocketbase';

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

export default function ServiceForm({ initialData }: { initialData?: Service }) {
  const [name, setName] = useState(initialData?.name || '');
  const [port, setPort] = useState(initialData?.port || '');
  const [prefix, setPrefix] = useState(initialData?.prefix || '');
  const [isActive, setIsActive] = useState(initialData?.isActive || false);
  
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<Service, 'id'> = {
      name,
      port,
      prefix,
      isActive
    };

    try {
      if (initialData?.id) {
        await pb.collection('services').update(initialData.id, payload);
      } else {
        await pb.collection('services').create(payload);
      }

      router.push('/services');
      router.refresh();
    } catch (err) {
      console.error('Failed to save service:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Name
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
              Port Number
            </label>
            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              required
              placeholder="1025-65535"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prefix
            </label>
            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              required
              placeholder="/svc"
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
              ? 'Update Service'
              : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
}
