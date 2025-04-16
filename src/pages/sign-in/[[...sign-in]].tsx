import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex grow items-center justify-center bg-gray-100">
      <SignIn />
    </div>
  );
}
