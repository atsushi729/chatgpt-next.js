import Image from "next/image";
import mainImage from "../public/motivation.jpeg";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">ChatGPT with Next.js</h1>
        <div>Enter a topic and the AI will generate a motivational quote.</div>
        <div className="flex flex-col items-center justify-center mt-10">
          <Image
            src="/motivation.jpeg"
            alt="Motivation"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
