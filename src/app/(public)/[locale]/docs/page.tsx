import { redirect } from "next/navigation";

const docPage = () => {
  return redirect("/docs/changelog");
};

export default docPage;
