"use client";

import { LogOut, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function Header() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 fixed top-0 right-0 left-10 sm:left-[72px] z-10">
      <div className="flex-1   relative bg-gradient-to-r from-[#0066cc] via-[#ff3d7e] to-[#33d3ff] h-[30px] sm:h-[60px] rounded-2xl flex justify-center items-center ">

        <img
          src="https://static.canva.com/web/images/856bac30504ecac8dbd38dbee61de1f1.svg"
          alt="canva"
          width={70}
          height={30}

        />
      </div>
      <div className="flex items-center gap-5 ml-12">
        <div className="flex items-center gap-1 cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger aschild="true">
              <div className="flex items-center space-x-2 ">
                <Avatar>
                  <AvatarFallback>
                    {session?.user?.name?.[0] || "U"}
                  </AvatarFallback>
                  <AvatarImage
                    src={session?.user?.image || "/placeholder-user.jpg"}
                  />
                </Avatar>
                <span className="text-sm font-medium hidden lg:block">
                  {session?.user?.name || "User"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={handleLogout}
                className={"cursor-pointer"}
              >
                <LogOut className="mr-2 w-4 h-4" />
                <span className="font-bold">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
