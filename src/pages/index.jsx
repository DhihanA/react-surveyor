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
      // allSurveys.forEach((doc) => {
      //   console.log(`${doc.id} => ${doc.data()}`);
      // });
      setAllQuests(allSurveys.docs);
      // console.log(allSurveys.docs)
      setQuestsLoading(false);
    }
    getAllSurveys();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Question:', question);
    // console.log('Options:', options);

    console.log('ok finished one');

    
};
  
  
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
      <div className="p-4 text-center">
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


        {allQuests && allQuests.map((docSnapshot, index) => {
          const quest = docSnapshot.data();

          return (
            <div key={index}>
              {quest.responders.includes(user.uid) ? (
                <p>You have already responded to this quest.</p>
              ) : (
                <div className="card bg-base-300 shadow-xl my-4">
                  <form onSubmit={handleSubmit} className="card-body">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-center block w-full text-lg font-bold">{quest.question}</span>
                      </label>

                      {quest.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center mb-3">
                          <input
                            type="radio"
                            name={`quest-${index}`}
                            value={opt}
                            className="radio radio-primary mr-2"
                            required
                          />
                          {opt}
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">
                      Finish Quest
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}



          
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