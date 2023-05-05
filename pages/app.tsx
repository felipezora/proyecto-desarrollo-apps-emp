import PrivateRoute from '@components/PrivateRoute';
import Link from 'next/link';

const app = () => (
  <PrivateRoute>
    <div className='flex h-screen w-full flex-col items-center justify-center gap-5'>
      <h1 className='text-center text-6xl'>
        Aca va el frontend del sistema de gestión de proyectos
      </h1>
      <Link href='/api/graphql'>
        <button>Ir al backend</button>
      </Link>
    </div>
  </PrivateRoute>
);

export default app;
