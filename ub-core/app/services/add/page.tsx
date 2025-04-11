// app/services/add/page.tsx
import ServiceForm from '@/components/ServiceForm';

export default function AddServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
      <ServiceForm />
    </div>
  );
}
