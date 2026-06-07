import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
import data from "../../data/portfolio.json";

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { name } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* MOBILE NAVIGATION */}
      <Popover className="block tablet:hidden pt-5 relative z-50">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-2 laptop:p-0">
              <h1
                onClick={() => router.push("/")}
                className="font-bold text-2xl text-white cursor-pointer select-none"
              >
                {name}.
              </h1>
              {/* ADD THIS BUTTON TO TRIGGER THE MENU */}
              <Popover.Button className="p-2 text-white outline-none">
                {open ? (
                  // Icon for "close"
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  // Icon for "menu"
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                )}
              </Popover.Button>
            </div>
            
            <Popover.Panel className="absolute right-0 z-50 w-11/12 p-4 bg-[#7fa2a9] shadow-xl rounded-md border border-white/20">
              {!isBlog ? (
                <div className="grid grid-cols-1 gap-2 text-white">
                  <Button onClick={handleWorkScroll} classes="text-white hover:bg-white/10">Work</Button>
                  <Button onClick={handleAboutScroll} classes="text-white hover:bg-white/10">About</Button>
                  {/* FORCED RESUME BUTTON */}
                  <Button onClick={() => router.push("/resume")} classes="text-white hover:bg-white/10 text-left">
                    Resume
                  </Button>
                  <Button onClick={() => window.open("mailto:haifarosli02@gmail.com")} classes="text-white hover:bg-white/10">
                    Contact
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 text-white">
                  <Button onClick={() => router.push("/")} classes="text-white hover:bg-white/10">Home</Button>
                  {/* FORCED RESUME BUTTON */}
                  <Button onClick={() => router.push("/resume")} classes="text-white hover:bg-white/10 text-left">
                    Resume
                  </Button>
                  <Button onClick={() => window.open("mailto:haifarosli02@gmail.com")} classes="text-white hover:bg-white/10">
                    Contact
                  </Button>
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>

      {/* DESKTOP NAVIGATION */}
      <div className="py-6 hidden flex-row items-center justify-between w-full relative z-50 tablet:flex">
        <h1
          onClick={() => router.push("/")}
          className="font-bold text-2xl text-white cursor-pointer select-none"
        >
          {name}.
        </h1>
        
        {!isBlog ? (
          <div className="flex items-center gap-2">
            <Button onClick={handleWorkScroll} classes="text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm">Work</Button>
            <Button onClick={handleAboutScroll} classes="text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm">About</Button>
            
            {/* FORCED RESUME BUTTON */}
            <Button onClick={() => router.push("/resume")} classes="text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm">
              Resume
            </Button>

            <Button onClick={() => window.open("mailto:haifarosli02@gmail.com")} classes="text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm">
              Contact
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/")} classes="text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm">Home</Button>
            
            {/* FORCED RESUME BUTTON */}
            <Button onClick={() => router.push("/resume")} classes="text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm">
              Resume
            </Button>

            <Button onClick={() => window.open("mailto:haifarosli02@gmail.com")} classes="text-white hover:bg-white/10 font-bold uppercase tracking-wider text-sm">
              Contact
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;