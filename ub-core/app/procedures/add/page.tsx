'use client';

import ProcedureForm from '@/components/ProcedureForm';

export default function NewProcedurePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Procedure</h1>
      <ProcedureForm />
    </div>
  );
}
