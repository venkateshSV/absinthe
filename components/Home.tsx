"use client";

import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const HomeComponent = () => {
  const [apiKey, setApiKey] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const router = useRouter();

  const createApiKey = async () => {
    try {
      const result = await axios.post(
        `https://absinthe-backend.vercel.app/api/api-key/create`
      );
      if (result.data.success) {
        setApiKey(result.data.data.api_key);
        setIsButtonDisabled(false);
        toast.success("Successfully created an API Key");
      } else {
        toast.error(result.data.error);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    }
  };

  const validApiKey = async () => {
    try {
      const result = await axios.post(
        `https://absinthe-backend.vercel.app/api/api-key/valid`,
        {
          apiKey: apiKey,
        }
      );
      if (result.data.success) {
        return true;
      } else {
        toast.error(result.data.error);
        return false;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsButtonDisabled(!e.target.value.trim());
  };

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <a
          href="#"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
        >
          <div>
            <div className="px-10">
              <div className="text-3xl font-extrabold">Points Dispersal</div>
            </div>
            <div className="pt-2">
              <LabelledInput
                label="API Key"
                placeholder="b43cc938-23b2-4725-820f-46385809f6fa"
                value={apiKey}
                onChange={handleInputChange}
              />
              <div className="mt-2">
                Do not have an API key?{" "}
                <span
                  className="text-blue-700"
                  onClick={async () => {
                    await createApiKey();
                  }}
                >
                  Create one
                </span>
              </div>
              <button
                type="button"
                disabled={isButtonDisabled}
                className={`mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                  isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={async () => {
                  const isValid = await validApiKey();
                  if (isValid) {
                    const url = `/projects?apiKey=${apiKey}`;
                    router.push(url);
                  }
                }}
              >
                Go to projects
              </button>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
interface LabelledInputType {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  value,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
