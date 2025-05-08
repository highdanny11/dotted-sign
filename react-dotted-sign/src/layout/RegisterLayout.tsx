import { Link } from 'react-router';

export function RegisterLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <header className="container mb-12 py-4 xl:mb-[10vh]">
        <Link className="text-brand text-sm leading-[24px]" to="/">
          回首頁
        </Link>
      </header>
      <main className="container">
        <div className="mx-auto max-w-[1076px]">{props.children}</div>
      </main>
    </>
  );
}
