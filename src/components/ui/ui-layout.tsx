import { ReactNode } from "react";
import Button  from "../wallet-button/button";

interface UIProps {
  children: ReactNode; // Define a prop type for children
}

export default function UI({ children }: UIProps) {
  return (
    <div className="h-screen flex flex-col"> {/* Use h-screen to make the component full height */}
      <div className="flex justify-ariund px-8 navbar p-4 bg-slate-900 text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0">
        <div className="flex-1 font-semibold text-2xl pt-1">BLINK BROS</div>
        <div className="flex-none space-x-2">
                <Button />
        </div>
      </div>
      <div className="flex-grow overflow-auto"> {/* Allow scrolling if the content exceeds the height */}
        {children} {/* Page content Rendered here */}
      </div>
      <footer className="footer footer-center p-3 bg-slate-900 text-base-content flex justify-center">
        <aside>
          <p>
            Created by{' '}
            <a
              className="link hover:text-white font-bold"
              href="https://github.com/GaudD"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gaud
            </a>
          </p>
        </aside>
      </footer>
    </div>
  );
}
