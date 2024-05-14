"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import Spinner from "./components/Spinner";
import Navbar from "./components/Navbar";

export default function Home() {
  //------------------------------------------------------------------
  //                          useState
  //------------------------------------------------------------------
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  //------------------------------------------------------------------
  //                         handleSubmit
  //------------------------------------------------------------------
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const prompt = message.trim();
    if (!prompt) return;

    setMessage("");
    setLoading(true);
    setLoadingError(false);

    try {
      const response = await fetch(
        "/api/motivation?prompt=" + encodeURIComponent(prompt),
        { method: "POST" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setQuote(data.quote);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setLoadingError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleChange(e: { target: { value: string } }) {
    setMessage(e.target.value);
  }

  //------------------------------------------------------------------
  //                         JSX element
  //------------------------------------------------------------------
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading ? (
        <div className="flex justify-center mt-5">
          <Spinner />
        </div>
      ) : (
        <>
          <Navbar />
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 flex justify-center my-5"
                >
                  You can enter your message here
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
            {loadingError && (
              <div className="flex justify-center mt-5">
                Error loading data!!! Please try again!!!
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
