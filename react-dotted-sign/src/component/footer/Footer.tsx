export function Footer() {
  return (
    <footer className="bg-dark-grey hidden min-h-[54px] py-4">
      <div className="container flex items-center justify-between">
        <a href="#" className="leading-1.6 text-sm text-white">
          @2022 The F2E 4th
        </a>
        <ul className="flex items-center gap-4">
          <li>
            <button type="button" className="leading-1.6 text-sm text-white">
              繁中
            </button>
          </li>
          <li>
            <button type="button" className="leading-1.6 text-sm text-white">
              English
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
}
