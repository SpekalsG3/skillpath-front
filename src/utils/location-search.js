import React from 'react';
import { useRouter } from 'next/router';

export default function useLocationSearch () {
  const router = useRouter();
  return React.useMemo(() => router.query, [router.asPath]);
}
