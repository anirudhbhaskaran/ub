// app/actions/deleteService.ts
'use server';

import pb from '@/lib/pocketbase';
import { redirect } from 'next/navigation';

export async function deleteService(id: string) {
  try {
    await pb.collection('services').delete(id);
  } catch (err) {
    console.error('Failed to delete service:', err);
  }

  redirect('/services');
}
