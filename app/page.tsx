import { redirect } from "next/navigation";

/** Fallback if middleware does not run; middleware negotiates locale for `/`. */
export default function RootPage() {
  redirect("/en");
}
