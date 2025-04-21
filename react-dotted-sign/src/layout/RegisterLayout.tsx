import { Outlet, useLocation } from 'react-router-dom';
import { Link } from "react-router";


export function RegisterLayout(props: { children: React.ReactNode }) {
  return (
    <>
    <header className='container py-4 mb-12 xl:mb-[10vh]'>
      <Link className='text-sm leading-[24px] text-brand' to="/">回首頁</Link>
    </header>
    <main className='container'>
      <div className='max-w-[1076px] mx-auto'>
        { props.children }
      </div>
    </main>
    </>
  )
}