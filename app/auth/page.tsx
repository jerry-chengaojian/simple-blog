"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function AuthPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          <Authenticator
            formFields={{
              signUp: {
                email: {
                  order: 1,
                  placeholder: "Enter your email",
                  label: "Email",
                },
                password: {
                  order: 2,
                  placeholder: "Enter password",
                  label: "Password",
                },
                confirm_password: {
                  order: 3,
                  placeholder: "Confirm password",
                  label: "Confirm password",
                },
              },
              signIn: {
                username: {
                  placeholder: "Enter your email",
                  label: "Email",
                },
                password: {
                  placeholder: "Enter password",
                  label: "Password",
                },
              },
              confirmSignUp: {
                confirmation_code: {
                  label: "Verification code",
                  placeholder: "Enter verification code",
                },
              },
            }}
            components={{
              Header() {
                return (
                  <div className="text-center py-8 px-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      📝 Blog Platform
                    </h1>
                    <p className="text-gray-600 text-base">
                      Sign in or sign up to start creating
                    </p>
                  </div>
                );
              },
            }}
          >
            {({ signOut, user }) => {
              // Auto redirect to home after login
              if (user) {
                router.push("/");
                return <div>Redirecting...</div>;
              }
              return <></>;
            }}
          </Authenticator>
        </div>
      </div>
    </>
  );
}
