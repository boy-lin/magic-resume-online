import { redirect } from "next/navigation";

const appPage = () => {
  return redirect("/app/dashboard");
};

export default appPage;
