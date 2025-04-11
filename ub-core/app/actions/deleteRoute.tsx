// app/actions/deleteProcedure.ts
'use server';

import pb from '@/lib/pocketbase';
import { redirect } from 'next/navigation';

export async function deleteRoute(id: string) {
  try {
    await pb.collection('routes').delete(id);
  } catch (err) {
    console.error('Failed to delete route:', err);
  }

  redirect('/routes');
}
