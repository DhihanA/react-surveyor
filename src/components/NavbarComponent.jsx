import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '@/firebase.js'; 
import SignOutComponent from '@/components/SignOutComponent';
import SignInComponent from '@/components/SignInComponent';

export default function Navbar() {
    const [user, loading, error] = useAuthState(auth);
    const [screenWidth, setScreenWidth] = useState(0);
    // const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    // console.log(screenWidth);
    // console.log('ahi was here');

    useEffect(() => {
      // need this check otherwise nextjs messes it up due to SSR
      if (typeof window !== "undefined") {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
  
        // needed for cleanup, honestly wish I understood why this was needed
        return () => window.removeEventListener('resize', handleResize);
      }
    }, []);

    // https://medium.com/@malikhamzav/how-to-close-daisyui-dropdown-on-click-ea65c5749410
    // need it to unfocus the dropdown element after clicking it
    const handleClick = () => {
      const elem = document.activeElement;
      if (elem) {
        elem?.blur();
      }
    };

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        )
      }
    
      if (error) {
        return (
          <div>Error: {error.message}</div>
        )
      }

    return (
      <>
        <div className="navbar bg-base-100">
            <div className="navbar-start">
              {screenWidth >= 1024 ? (
                undefined
              ) : (
                // nabbed this from prev proj
                <div className="dropdown">
                  {/* <div tabIndex={0} role="button" className="btn m-1">Click</div> */}
                  <label tabIndex="0" className="btn btn-ghost lg:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <Link href='/' className="btn btn-ghost text-sm" onClick={handleClick}>Home</Link>
                        <Link href='/info' className="btn btn-ghost text-sm" onClick={handleClick}>What Is This?</Link>
                        {user ? (
                          <Link href='/quest' className="btn btn-ghost text-sm" onClick={handleClick}>Create Survey</Link>
                        ) : undefined}
                    </ul>
                </div>
              )}
              <Link href='/' className="btn btn-ghost text-xl">daisyUI TBD</Link>
            </div>


            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <Link href='/' className="btn btn-ghost text-xl">Home</Link>
                    <Link href='/info' className="btn btn-ghost text-xl">What Is This?</Link>
                    {user ? (
                      <Link href='/quest' className="btn btn-ghost text-xl">Create Quest</Link>
                    ) : undefined}
                </ul>
            </div>


            <div className="navbar-end">
                {user ? (
                    <SignOutComponent />
                ) : (
                    undefined
                    // <SignInComponent />
                )}
            </div>

        </div>
      </>
    )
  }