// app/actions/deleteProcedure.ts
'use server';

import pb from '@/lib/pocketbase';
import { redirect } from 'next/navigation';

export async function deleteProcedure(id: string) {
  try {
    await pb.collection('procedures').delete(id);
  } catch (err) {
    console.error('Failed to delete procedure:', err);
  }

  redirect('/procedures');
}
