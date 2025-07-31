import { ReactNode } from "react";
import "./globals.css";
import "./font.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
