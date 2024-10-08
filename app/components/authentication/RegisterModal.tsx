import React, { useState } from "react";
import { auth } from "@/app/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  deleteUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import axios from "axios"; // Added for making HTTP requests
import FacebookIcon from "@/public/images/auth/facebook-logo.png";
import GoogleIcon from "@/public/images/auth/google-logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link"; // Add this import
import { useAuth } from "./AuthContext"; // Add this import
import { useOpenAuthModal } from "@/app/utils/authHelpers";

// Use environment variable for backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface RegisterModalProps {
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  onClose,
  isLoading,
  setIsLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { createNewUser, isHandlingAuth, handleAuthError } = useAuth();
  const openAuthModal = useOpenAuthModal();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setTermsError("");
    setError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (!agreeTerms) {
      setTermsError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    isHandlingAuth.current = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      try {
        await createNewUser(firebaseUser, true);
      } catch (createError) {
        await handleAuthError(firebaseUser, createError);
        setError("Registration failed. Unable to create user in the database.");
        return;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (
        error instanceof FirebaseError &&
        error.code === "auth/email-already-in-use"
      ) {
        setError(
          "This email is already in use. Please try a different email or sign in."
        );
      } else {
        setError(`Registration failed: ${error}`);
      }
    } finally {
      setIsLoading(false);
      isHandlingAuth.current = false;
    }
  };

  const handleSocialRegister = async (
    provider: GoogleAuthProvider | FacebookAuthProvider
  ) => {
    setError("");
    setTermsError("");
    if (!agreeTerms) {
      setTermsError("Please agree to the Terms and Privacy Policy.");
      return;
    }
    setIsLoading(true);
    isHandlingAuth.current = true;
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      try {
        await createNewUser(firebaseUser, true);
      } catch (createError) {
        await handleAuthError(firebaseUser, createError);
        setError("Registration failed. Unable to create user in the database.");
        return;
      }
    } catch (error) {
      console.error("Social registration failed:", error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/account-exists-with-different-credential") {
          setError(
            "An account already exists with the same email address but different sign-in credentials. Please sign in using the original method."
          );
        } else {
          setError(`Registration failed: ${error.message}`);
        }
      } else {
        setError(`Registration failed. ${error}`);
      }
    } finally {
      setIsLoading(false);
      isHandlingAuth.current = false;
    }
  };

  return (
    <div className="w-4/5 max-h-[90vh] sm:w-1/2 xl:w-1/3 overflow-y-auto py-16 flex flex-col gap-4 px-6 sm:px-14 bg-gray-900 rounded-2xl relative text-white">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 text-xl hover:text-gray-200"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold text-center">Register</h2>
      <form onSubmit={handleEmailRegister} className="flex flex-col gap-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700 focus:border-gray-600 focus:outline-none"
          />
          {emailError && (
            <p className="text-red-400 text-sm mt-1">{emailError}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700 focus:border-gray-600 focus:outline-none"
          />
          {passwordError && (
            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (e.target.checked) setTermsError("");
              }}
              className="mr-2"
            />
            <label htmlFor="agreeTerms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary">
                Privacy Policy
              </Link>
            </label>
          </div>
          {termsError && (
            <p className="text-red-400 text-sm mt-1">{termsError}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-secondary transition duration-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
          Register
        </button>
      </form>
      {error && <p className="text-red-400 text-center">{error}</p>}
      <div className="flex justify-center space-x-8">
        <button
          onClick={() => handleSocialRegister(new GoogleAuthProvider())}
          className="p-2 border rounded bg-gray-800 border-gray-700 hover:border-gray-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <Image src={GoogleIcon} alt="Google" width={24} height={24} />
          )}
        </button>
        <button
          onClick={() => handleSocialRegister(new FacebookAuthProvider())}
          className="p-2 border rounded bg-gray-800 border-gray-700 hover:border-gray-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <Image src={FacebookIcon} alt="Facebook" width={24} height={24} />
          )}
        </button>
      </div>
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          onClick={() => openAuthModal("login")}
          className="text-primary hover:underline"
          disabled={isLoading}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default RegisterModal;
