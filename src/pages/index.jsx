import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '@/firebase.js'; 
import SignInComponent from '@/components/SignInComponent'

export default function Home() {
  // home page
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
      <div className="p-4">
        {/* <button className="btn btn-primary">Hello daisyUI!</button> */}
        {user ? (
        // can show the users the actual dashboard
        <div>
          <h1>Welcome, {user.displayName}!</h1>
          <p>Your email: {user.email}</p>
        </div>
        ) : (
          // need to let them sign in here
          <div>
            <h1>Please sign in to continue</h1>
            <SignInComponent />
          </div>
        )}
      </div>
    </>
  )
}