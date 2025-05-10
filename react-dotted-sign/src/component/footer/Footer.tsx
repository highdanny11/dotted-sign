export function Footer() {
  return (
    <footer className="bg-dark-grey min-h-[54px] py-4">
      <div className="container flex items-center justify-center">
        <span className="leading-1.6 text-sm text-white">
          @2022 The F2E 4th Code: highdanny11 / Design: Coral
          <a href="mailto:highdanny11@gmail.com" className="pl-5">
            聯絡信箱：highdanny11@gmail.com
          </a>
        </span>
        {/* <ul className="flex items-center gap-4">
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
        </ul> */}
      </div>
    </footer>
  );
}
