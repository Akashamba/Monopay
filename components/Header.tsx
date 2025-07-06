"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, LoaderPinwheel, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = authClient.useSession().data?.user;
  const isUserLoading = authClient.useSession().isPending;
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-semibold text-slate-900">MonopolyPay</span>
        </div>
        <div className="">
          {isUserLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : user ? (
            <Button
              variant="ghost"
              className="w-10 h-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {`${user?.name.charAt(0)}`}
                </AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <Link href="/sign-in">Sign In</Link>
          )}

          {/* Mobile Navigation */}
          {user && isMenuOpen && (
            <div className="animate-fade-in">
              <div className="space-y-1 border-t px-2 pt-2 pb-3 sm:px-3">
                <div className="border-t pt-2">
                  <div className="px-3 py-2">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {user.email}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
