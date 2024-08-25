import { auth } from '@/firebase.js'; 
import { signOut } from "firebase/auth";

export default function SignOut() {
    const handleSignOut = () => {
        signOut(auth).catch(error => console.error('Sign-out error:', error));
    };

    return (
        <button className="btn btn-primary" onClick={handleSignOut}>
            Sign Out
        </button>
    );
}