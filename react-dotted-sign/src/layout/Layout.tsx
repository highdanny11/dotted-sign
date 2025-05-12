import { HomeHeader } from '../component/header/HomeHeader';
import { Footer } from '../component/footer/Footer';
import { Outlet } from 'react-router-dom';
export function Layout() {
  return (
    <div className='min-h-screen'>
      <HomeHeader />
      <main className='min-h-[calc(100vh-173px)]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
