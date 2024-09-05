import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '@/firebase.js'; 
import { collection, getDoc, getDocs, doc, updateDoc, deleteDoc, arrayUnion, increment } from "firebase/firestore";
import SignInComponent from '@/components/SignInComponent'
import NavbarComponent from "@/components/NavbarComponent";
import { useRouter } from "next/router";
// import { useRouter } from "next/router";

export default function Home() {
  // home page
  const [user, loading, error] = useAuthState(auth);
  const [allQuests, setAllQuests] = useState(null); // all the quests currently up
  const [questsLoading, setQuestsLoading] = useState(true); // loading state for when im fetching the quests from firestore
  const [selectedOptions, setSelectedOptions] = useState({});
  const router = useRouter();

  // getting all the surveys and updating the state (and DB) in this
  useEffect(() => {
    const getAllSurveys = async () => {
      setQuestsLoading(true);
      const allSurveys = await getDocs(collection(db, "surveys")); // returns all the documents in the collection "surveys"
      const now = new Date();

////////////////////////////////////////////////////////////////////////////////
      // * DELETING EXPIRED SURVEYS FROM THE DB OVER HERE, IN THE CLIENT
      const expiredSurveys = allSurveys.docs.filter((survey) => {
        const expiresAt = survey.data().expiresAt.toDate();
        return expiresAt < now;
      });

      expiredSurveys.forEach(async (survey) => {
        await deleteDoc(doc(db, "surveys", survey.id)); // deleting the expired surveys
        // console.log(`deleting da survey with ID: ${survey.id}`);
      });
////////////////////////////////////////////////////////////////////////////////
    
      const validSurveys = allSurveys.docs.filter((survey) => {
        const expiresAt = survey.data().expiresAt.toDate();
        return expiresAt >= now;  // only keeping da surveys that haven't expired
      });
      
      setAllQuests(validSurveys);
      setQuestsLoading(false);
    }
    getAllSurveys();
  }, []);

  // honestly wish i knew what was happening here
  const handleOptionChange = (questId, optIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questId]: optIndex
    }));
  };

  // add the user ID to the submitted quest's responders array on submit
  const handleSubmit = async (e, questId) => {
    e.preventDefault();
    console.log('ok finished one');

    const options = ['option1', 'option2', 'option3', 'option4'];
    const optIndex = selectedOptions[questId]; // getting the optIndex of the quest they submitted. using questId to get the optIndex for the specific quest they did
    const selectedOption = options[optIndex]; // mapping the option index to the appropriate anxwer that they submitted

    try {
      let questRef = doc(db, 'surveys', questId); // getting the doc reference
      // updates doc
      await updateDoc(questRef, {
        responders: arrayUnion(user.uid), // adds the string user.uid to the responders array without creating a new array

        [`responses.${selectedOption}`]: increment(1) // incrementing the selected option by 1
      });

      console.log('successfully added user.uid to responders')
    } catch (err) {
      console.error(`Error updating doc: ${err}`);
    }
    // router.reload();

    // need to update the allQuests state and modify the quest that was just submitted
    setAllQuests((prevQuests) => 
      // iterating over every quest
      prevQuests.map((docSnapshot) => {
        // only need to modify the quest that we actually changed currently
        if (docSnapshot.id === questId) {
          // Update the quest data with the new response and responder
          const updatedQuest = {
            ...docSnapshot.data(),
            responders: [...docSnapshot.data().responders, user.uid],
            responses: {
              ...docSnapshot.data().responses,
              [selectedOption]: (docSnapshot.data().responses[selectedOption] || 0) + 1,
            }
          };

          return {
            ...docSnapshot,
            data: () => updatedQuest,
          };
        }
        return docSnapshot;
      })
    );
};
  
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    )
  }

  // need this so the screen doesn't flash before showing the correct screen to the user
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
        {/* <NavbarComponent /> */}
        {user ? (
          // can show the users the actual dashboard
          <div>
          <h1 className="mb-5 text-4xl font-bold">Welcome, {user.displayName}!</h1>
          
          {/* have this here temporarily */}
          {allQuests && (

            <p className="mb-6 text-lg font-normal text-slate-500">We have {allQuests.length} quests...</p>
          )}

          {/* iterating over all the quests, making a form for each unsubmitted one */}
          {/* for the submitted ones, need to show them the responses to that quest */}
          {allQuests && allQuests.map((docSnapshot, index) => {
            const quest = docSnapshot.data(); // the actual document data
            const questId = docSnapshot.id; // the ID of the document that's generated by firestore

            return (
              <div key={index}>
                {/* check here to see if the current user has already responded to this quest or not */}
                {quest.responders.includes(user.uid) ? (
                  <div className="card bg-base-300 shadow-xl my-4">
                    <div className="card-body">
                      <label className="label">
                        <span className="label-text text-center block w-full text-lg font-bold">Quest Results -{'>'} {quest.question}</span>
                      </label> 

                      {quest.options.map((opt, optIndex) => {
                          const numResponders = quest.responders.length; // total number of users who responded atm
                          const responseCount = quest.responses[`option${optIndex + 1}`] || 0; // count of users for the curr option
                          const percentage = numResponders > 0 ? (responseCount / numResponders) * 100 : 0; // calculating percentage

                          return (
                            <div key={optIndex} className="my-2">
                              <div className="flex justify-between mb-1">
                                <span>{opt}</span>
                                <span>{responseCount} {responseCount === 1 ? 'user' : 'users'} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <progress className="progress progress-success" value={percentage} max="100"></progress>
                            </div>
                          );
                      })}

                    </div>
                  </div>

                ) : (
                  // form stuff here. on submit, im sending the questId so that I can later use it to reference the now 
                  // submitted form and add the user's ID to the responders array inside it
                  // TODO: make it update seamlessly without requiring a reload
                  // !!!!!
                  <div className="card bg-base-300 shadow-xl my-4">
                    <form onSubmit={(e) => handleSubmit(e, questId)} className="card-body">
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
                              onChange={() => handleOptionChange(questId, optIndex)}
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
          // the homepage for when you are signed out
          <div>

            <div className="hero min-h-screen">
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">QuickQuest</h1>
                  <p className="mb-5 text-lg">Create quick polls and get instant feedback from your audience.</p>
                  <SignInComponent />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
              <div className="feature-card">
                <i className="fas fa-poll-h text-4xl mb-4"></i>
                <h3 className="text-2xl font-semibold">Create Polls Instantly</h3>
                <p>Get your audience's opinion in seconds.</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-users text-4xl mb-4"></i>
                <h3 className="text-2xl font-semibold">Real-time Results</h3>
                <p>Watch as the results roll in live.</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-chart-pie text-4xl mb-4"></i>
                <h3 className="text-2xl font-semibold">Simple & Intuitive</h3>
                <p>Designed to be easy for everyone.</p>
              </div>
            </div>


            <footer className="footer p-4 bg-neutral text-neutral-content">
              <div>
                <span className="footer-title">QuickQuest</span>
                <a href="mailto:contactquickquest@gmail.com" className="link link-hover">Email</a>
              </div>
              <div>
                <span className="footer-title">Check Me Out</span>
                <a href="https://dhihan.com" className="link link-hover" target="_blank">Website</a>

              </div>
            </footer>


          </div>
        )}
      </div>
    </>
  )
}