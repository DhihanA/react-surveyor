import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '@/firebase.js'; 
import { collection, getDocs } from "firebase/firestore";
import SignInComponent from '@/components/SignInComponent'

export default function Home() {
  // home page
  const [user, loading, error] = useAuthState(auth);
  const [allQuests, setAllQuests] = useState(null);
  const [questsLoading, setQuestsLoading] = useState(true);


  useEffect(() => {
    const getAllSurveys = async () => {
      setQuestsLoading(true);
      const allSurveys = await getDocs(collection(db, "surveys"));
      // console.log(allSurveys);
      allSurveys.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
      setAllQuests(allSurveys.docs);
      setQuestsLoading(false);
    }
    getAllSurveys();
  }, []);
  
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    )
  }

  if (questsLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-infinity loading-lg"></span>
        </div>
    );
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
          <p>Your UID: {user.uid}</p>
          
          {allQuests && (
            <p>We have {allQuests.length} quests</p>
          )}




          
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