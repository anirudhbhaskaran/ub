// app/routes/add/page.tsx
import RouteForm from '@/components/RouteForm';

export default function AddRoutePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Route</h1>
      <RouteForm />
    </div>
  );
}
