import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '@/firebase.js'; 
import SignOutComponent from '@/components/SignOutComponent'

export default function Navbar() {
    const [user, loading, error] = useAuthState(auth);

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
                <a className="btn btn-ghost text-xl">daisyUI TBD</a>
            </div>


            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <Link href='/' className="btn btn-ghost text-xl">{user ? "Home" : "Sign In"}</Link>
                    <Link href='/info' className="btn btn-ghost text-xl">What Is This?</Link>
                </ul>
            </div>


            <div className="navbar-end">
                {user ? (
                    <SignOutComponent />
                ) : (
                    <div className="invisible">
                        <button className="btn btn-ghost">Placeholder</button>
                    </div>
                )}
            </div>

        </div>
      </>
    )
  }