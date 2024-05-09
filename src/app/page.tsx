"use client";

import Image from "next/image";
import { useState } from "react";
import Spinner from "./components/Spinner";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log("Form Data Submitted:", message);
    // Add your code to handle form submission, such as sending data to a backend server
  }

  async function handleChange(e: { target: { value: string } }) {
    setMessage(e.target.value);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading ? (
        <div className="flex justify-center mt-5">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">ChatGPT with Next.js</h1>
          <div>
            Enter a topic and the AI will generate a motivational quote.
          </div>
          <div className="flex flex-col items-center justify-center mt-10">
            <Image
              src="/motivation.jpeg"
              alt="Motivation"
              width={500}
              height={300}
              className="rounded-lg"
            />
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={message}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
