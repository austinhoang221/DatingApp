"use client";
import { useToast } from "@/app/_context/ToastContext";
import { AuthenticationService } from "@/app/_services/authentication.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { signIn } from "next-auth/react";
import { useAppDispatch } from "@/app/_redux/store";
import { IAuthState, login } from "@/app/_redux/authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const { showToast } = useToast();
  const router = useRouter();

  const onSubmit = async () => {
    await AuthenticationService.register({
      email: email,
      password: password,
    }).then((e) => {
      if (e) {
        router.push("/register/info");
        dispatch(login(e as IAuthState));
      } else {
        showToast("error", "Incorrect username or password");
      }
    });
  };

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: `${window.location.origin}`,
    });
  };
  return (
    <>
      <div className="bg-white rounded-lg py-5 text-center">
        <div className="container flex flex-col mx-auto bg-white rounded-lg my-5">
          <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
            <div className="flex items-center justify-center w-full ">
              <div className="flex items-center xl:p-10">
                <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                  <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                    Register
                  </h3>
                  <p className="mb-4 text-grey-700">
                    Enter your username and password
                  </p>
                  <a
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300"
                  >
                    <img
                      className="h-5 mr-2"
                      src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                      alt=""
                    />
                    Sign in with Google
                  </a>
                  <div className="flex items-center mb-3">
                    <hr className="h-0 border-b border-solid border-grey-500 grow"></hr>
                    <p className="mx-4 text-grey-600">or</p>
                    <hr className="h-0 border-b border-solid border-grey-500 grow"></hr>
                  </div>
                  <label
                    htmlFor="email"
                    className="mb-2 text-sm text-start text-grey-900"
                  >
                    Username*
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <label
                    htmlFor="password"
                    className="mb-2 text-sm text-start text-grey-900"
                  >
                    Password*
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />

                  <button
                    className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl  focus:ring-4  bg-orange-500"
                    onClick={onSubmit}
                    type="button"
                  >
                    Register
                  </button>
                  <p className="text-sm leading-relaxed text-grey-900">
                    Already have an account?{" "}
                    <Link className="font-bold text-grey-700" href="/login">
                      Sign In
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
