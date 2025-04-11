'use client';

import { deleteService } from '@/app/actions/deleteService';

export default function DeleteServiceButton({ id }: { id: string }) {
  const handleClick = async () => {
    const confirmed = confirm('Are you sure you want to delete this service?');
    if (confirmed) {
      await deleteService(id);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
    >
      Delete
    </button>
  );
}
