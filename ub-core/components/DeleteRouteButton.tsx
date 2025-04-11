'use client';

import { deleteRoute } from "@/app/actions/deleteRoute";

export default function DeleteProcedureButton({ id }: { id: string }) {
  const handleClick = async () => {
    const confirmed = confirm('Are you sure you want to delete this route?');
    if (confirmed) {
      await deleteRoute(id);
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
