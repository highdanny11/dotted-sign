import { HomeHeader } from '../component/header/HomeHeader';
import { Footer } from '../component/footer/Footer';
import { Outlet } from 'react-router-dom';
export function Layout() {
  return (
    <>
      <HomeHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
