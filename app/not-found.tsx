import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-6">
      <h1 className="text-5xl text-center font-bold text-gray-800 dark:text-gray-100">
        404 - Page Not Found
      </h1>
      <Card className="max-w-md w-full p-6 border-8 border-orange-500 flex flex-col items-center space-y-6 bg-orange-50">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-orange-600 font-serif">
            GET OUT OF 404 FREE
          </h2>
          <div className="border-t-2 border-b-2 border-orange-500 py-4 my-4">
            <p className="text-xl text-gray-700 font-medium">
              This card may be kept until needed or sold
            </p>
          </div>
          <p className="text-gray-600 italic">
            Looks like you landed on the wrong property! This page has either
            been mortgaged or doesn't exist.
          </p>
        </div>

        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white w-full max-w-xs"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </Card>
    </div>
  );
}
