import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '@/firebase.js';
import { addDoc, collection, getDocs } from "firebase/firestore"; // gonna use this to add the doc to the collection soon


export default function Quest() {
    const [user, loading, error] = useAuthState(auth);

    const [question, setQuestion] = useState('');
    const [quest, setQuest] = useState(null);
    const [options, setOptions] = useState(['', '', '', '']);
    const [allQuests, setAllQuests] = useState(null);
    const [questsLoading, setQuestsLoading] = useState(true);
    const router = useRouter();

    // protects this route from non-authenticated users
    useEffect(() => {
      if (!loading && !user) {
        router.replace('/');
      }
    }, [user, loading, router]);
  
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    useEffect(() => {
        if (quest) {
            const addSurvey = async () => {
                try {
                    const docRef = await addDoc(collection(db, "surveys"), quest);
                    console.log("Document written with ID: ", docRef.id);
                  } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }


            addSurvey();
        }
    }, [quest]);

    useEffect(() => {
      const getAllSurveys = async () => {
        setQuestsLoading(true);
        const allSurveys = await getDocs(collection(db, "surveys"));
        // console.log(allSurveys);
        // allSurveys.forEach((doc) => {
        //   console.log(`${doc.id} => ${doc.data()}`);
        // });
        setAllQuests(allSurveys.docs);
        setQuestsLoading(false);
      }
      getAllSurveys();
    }, [quest]);


  
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('Question:', question);
        // console.log('Options:', options);

        let currDate = new Date();        
        const userQuest = {
            'question': question,
            'options': options,
            'responses': {
                'option1': 0,
                'option2': 0,
                'option3': 0,
                'option4': 0
            },
            'responders': [],
            'createdBy': user.uid,
            'createdAt': currDate,
            'expiresAt': new Date(currDate.getTime() + 60 * 60 * 1000)
        };

        console.log(userQuest);
        setQuest(userQuest);
        
        setQuestion('');
        setOptions(['', '', '', '']);
    };
  
    if (questsLoading) {
      return (
          <div className="flex justify-center items-center h-screen">
              <span className="loading loading-infinity loading-lg"></span>
          </div>
      );
    }

    return (
      <div className="p-4 text-center">
        {allQuests && allQuests.length >= 4 ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="alert alert-info shadow-lg flex items-center justify-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xl font-bold ml-3">Maximum Quests Reached</span>
            </div>
            <p className="mt-4 text-lg text-slate-500">
              You've reached the limit of active quests. Please wait for some to expire before creating new ones.
            </p>
            <button 
              className="btn btn-primary mt-6" 
              onClick={() => router.push('/')}
            >
              Return to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Quest-ion</span>
              </label>
              <input
                type="text"
                placeholder="Enter your question here..."
                className="input input-bordered w-full"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
    
            {options.map((option, index) => (
              <div key={index} className="form-control">
                <label className="label">
                  <span className="label-text">Option {index + 1}</span>
                </label>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}...`}
                  className="input input-bordered w-full"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
    
            <button type="submit" className="btn btn-primary mt-4">
              Create Survey
            </button>
          </form>
        )}
      </div>
    );
}