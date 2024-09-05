import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase.js";

export default function Info() {
    // const [user, loading, error] = useAuthState(auth);
    // const router = useRouter();

    // // protects this route from non-authenticated users
    // useEffect(() => {
    //   if (!loading && !user) {
    //     router.replace('/');
    //   }
    // }, [user, loading, router]);

    // if (loading) {
    //   return (
    //     <div className="flex justify-center items-center h-screen">
    //         <span className="loading loading-infinity loading-lg"></span>
    //     </div>
    //   );
    // }

    return (
      <div className="min-h-screen bg-base-200 py-12 px-6">
        {/* the max-w-#xl determines how spreadout everything is here */}
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8">What is QuickQuest?</h1>
          <p className="text-lg mb-6">
            QuickQuest is a platform that lets you create quick, one-question polls and gather instant feedback from your audience. Whether you want to make decisions, gather opinions, or just have fun with quick surveys, QuickQuest makes it easy and fast!
          </p>
  
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="info-step">
                <i className="fas fa-question-circle text-4xl mb-4 text-primary"></i>
                <h3 className="text-xl font-bold mb-2">1. Create a Quest</h3>
                <p>
                  Start by signing in and creating your own quest by asking a simple question. Provide up to four answer options for your audience to choose from.
                </p>
              </div>
              <div className="info-step">
                <i className="fas fa-share-alt text-4xl mb-4 text-primary"></i>
                <h3 className="text-xl font-bold mb-2">2. Share It</h3>
                <p>
                  Once your quest is live, it will be available for others to respond to for a limited time <b>(1 hour)</b>. Share it with your friends, colleagues, or any group you want feedback from.
                </p>
              </div>
              <div className="info-step">
                <i className="fas fa-chart-line text-4xl mb-4 text-primary"></i>
                <h3 className="text-xl font-bold mb-2">3. View Results</h3>
                <p>
                  Watch as the results come in real-time! See how many people chose each option and analyze the feedback you receive to make informed decisions.
                </p>
              </div>
            </div>
          </div>
  
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">Getting Started</h2>
            <p className="text-lg mb-4">
              Ready to start using QuickQuest? Follow these simple steps:
            </p>
            <ul className="list-decimal list-inside text-left text-lg mb-6">
              <li>Sign in with your Google account to access all features.</li>
              <li>Create your first quest by filling out the question and options.</li>
              <li>Share your quest with others and watch the responses roll in.</li>
              <li>View the results and use the insights to make your next move.</li>
            </ul>
            <p className="text-lg">
              It's that easy! QuickQuest is designed to be user-friendly, so you can focus on what matters most—getting the answers you need.
            </p>
          </div>
  
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">What to Expect</h2>
            <p className="text-lg mb-4">
              As a user of QuickQuest, you can expect:
            </p>
            <ul className="list-disc list-inside text-left text-lg mb-6">
              <li>Fast and intuitive poll creation.</li>
              <li>Real-time updates as responses come in.</li>
              <li>Insightful data to help you make informed decisions.</li>
              <li>A clean and simple interface that anyone can use.</li>
            </ul>
            <p className="text-lg">
              QuickQuest is perfect for anyone looking to gather opinions quickly and efficiently. Whether you're planning an event, making a decision, or just curious about what others think, QuickQuest is here to help.
            </p>
          </div>
  
          <div>
            <h2 className="text-3xl font-semibold mb-4">Need Help?</h2>
            <p className="text-lg">
              If you have any questions or need assistance, don't hesitate to reach out to me at <a href="mailto:contactquickquest@gmail.com" className="text-primary font-semibold">contactquickquest@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
  