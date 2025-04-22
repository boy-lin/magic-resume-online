"use client";
import React, { useEffect, useState } from "react";

const NextPage = () => {
  const [list, setList] = useState([
    {
      label: "text-stone-200",
      value: "color: rgb(231 229 228 / var(--tw-text-opacity, 1));",
    },
    {
      label: "text-gray-200",
      value: "",
    },
    {
      label: "text-primary",
      value: "",
    },
    {
      label: "text-letter",
      value: "",
    },
    {
      label: "text-letter-head",
      value: "",
    },
    {
      label: "text-letter/[.6]",
      value: "",
    },
  ]);

  return (
    <div className="self-start py-12 sm:px-6 lg:px-8">
      <div className="flex flex-1 flex-col justify-center max-w-4xl m-auto">
        <table>
          <thead>
            <tr>
              <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
                <div className="py-2 pr-2 border-b border-slate-200 dark:border-slate-400/20">
                  Class
                </div>
              </th>
              <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
                <div className="py-2 pr-2 border-b border-slate-200 dark:border-slate-400/20">
                  Properties
                </div>
              </th>
              <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
                <div className="py-2 pl-2 border-b border-slate-200 dark:border-slate-400/20">
                  <span className="sr-only">Preview</span>&nbsp;
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="align-baseline">
            {list.map((it) => (
              <tr key={it.label}>
                <td
                  translate="no"
                  className="py-2 pr-2 font-mono font-medium text-xs leading-6 text-sky-500 whitespace-nowrap dark:text-sky-400 border-t border-slate-100 dark:border-slate-400/10"
                >
                  {it.label}
                </td>
                <td
                  translate="no"
                  className="py-2 pl-2 font-mono text-xs leading-6 text-indigo-600 whitespace-pre dark:text-indigo-300 border-t border-slate-100 dark:border-slate-400/10 hidden sm:table-cell sm:pr-2"
                >
                  {it.value}
                </td>
                <td className="text-center font-medium text-base whitespace-nowrap align-middle border-t border-slate-100 dark:border-slate-400/10">
                  <div className={"w-16 mx-auto" + ` ${it.label}`}>Aa</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NextPage;
