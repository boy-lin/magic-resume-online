"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const page = (props) => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-letter-head">
          {title}
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-letter sm:text-xl/8">
          {description}
        </p>
      </div>
    </main>
  );
};

export default page;
