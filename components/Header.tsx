"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Moon, Sun, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import ProfilePictureSkeleton from "./ProfilePictureSkeleton";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = authClient.useSession().data?.user;
  const isUserLoading = authClient.useSession().isPending;
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:bg-slate-950 dark:border-slate-800">
      <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">MonopolyPay</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {isUserLoading ? (
            <ProfilePictureSkeleton size={40} />
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
        </div>
      </div>
      {/* Mobile Navigation */}
      {user && isMenuOpen && (
        <div className="animate-fade-in">
          <div className="space-y-1 border-t border-gray-200 dark:border-slate-800 px-2 pt-2 pb-3 sm:px-3">
            <div className="px-3 py-2">
              <div className="font-medium dark:text-white">{user.name}</div>
              <div className="text-muted-foreground text-sm">{user.email}</div>
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
      )}
    </nav>
  );
}

export default Header;
