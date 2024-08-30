import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '@/firebase.js';
import { addDoc, collection } from "firebase/firestore"; // gonna use this to add the doc to the collection soon


export default function Quest() {
    const [user, loading, error] = useAuthState(auth);

    const [question, setQuestion] = useState('');
    const [quest, setQuest] = useState(null);
    const [options, setOptions] = useState(['', '', '', '']);
  
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
            'createdBy': user.uid,
            'createdAt': currDate,
            'expiresAt': new Date(currDate.getTime() + 60 * 60 * 1000)
        };

        console.log(userQuest);
        setQuest(userQuest);
        
        setQuestion('');
        setOptions(['', '', '', '']);
    };
  
    return (
      <div className="p-4 text-center">
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
      </div>
    );
}