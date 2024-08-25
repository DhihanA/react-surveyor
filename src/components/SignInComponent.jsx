import { auth, provider } from '@/firebase.js';
import { signInWithPopup } from "firebase/auth";

export default function SignIn() {
    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
        } catch (e) {
            console.error(e)
            
        }
    };

    return (
        <button className="btn btn-primary" onClick={handleSignIn}>
            Sign in with Google
        </button>
    );
}