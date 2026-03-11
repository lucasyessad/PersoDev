import { redirect } from 'next/navigation';
import { proPath } from '@/lib/utils/paths';

export default async function AqarProRoot({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(proPath(slug, 'dashboard'));
}
