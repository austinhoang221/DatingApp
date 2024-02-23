"use client";
import Toast from "@/app/_components/toast/page";
import { login } from "@/app/_redux/authSlice";
import { useAppDispatch } from "@/app/_redux/store";
import { AuthenticationService } from "@/app/_services/authentication.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
export interface IToast {
  show: boolean;
  type: "success" | "danger" | "warning";
  message: string;
}
export default function Login() {
  const [userName, setUserName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [toast, setToast] = React.useState<IToast | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onSubmit = async () => {
    await AuthenticationService.logIn({
      userName: userName,
      password: password,
    }).then((e) => {
      const result = {
        userName: e?.userName!,
        token: e?.token!,
        isLoggedIn: true,
      };
      setToast({ show: true, type: "success", message: "Success" });
      router.push("/home");
      dispatch(login(result));
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
                    Sign In
                  </h3>
                  <p className="mb-4 text-grey-700">
                    Enter your email and password
                  </p>
                  <a className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300">
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
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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
                  <div className="flex flex-row justify-between mb-8">
                    <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-5 h-5 bg-white border-2 rounded-sm border-grey-500 peer peer-checked:border-0 peer-checked:bg-orange-500">
                        <img
                          className=""
                          src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png"
                          alt="tick"
                        />
                      </div>
                      <span className="ml-3 text-sm font-normal text-grey-900">
                        Keep me logged in
                      </span>
                    </label>
                    <a className="mr-4 text-sm font-medium text-orange-500">
                      Forget password?
                    </a>
                  </div>
                  <button
                    className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl  focus:ring-4  bg-orange-500"
                    onClick={onSubmit}
                    type="button"
                  >
                    Sign In
                  </button>
                  <p className="text-sm leading-relaxed text-grey-900">
                    Not registered yet?{" "}
                    <Link href="register" className="font-bold text-grey-700">
                      Create an Account
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast
        show={toast?.show ?? false}
        message={toast?.message ?? ""}
        type={toast?.type ?? "success"}
        onDismiss={() => setToast(null)}
      />
    </>
  );
}
