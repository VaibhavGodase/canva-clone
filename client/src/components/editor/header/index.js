"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store";
import {
  ChevronDown,
  Download,
  Eye,
  Loader2,
  LogOut,
  Pencil,
  Save,
  SaveOff,
  Share,
  Star,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ExportModal from "../export";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const {
    isEditing,
    setIsEditing,
    name,
    setName,
    canvas,
    saveStatus,
    markAsModified,
    designId,
    userDesigns,
    userSubscription,
    setShowPremiumModal,
  } = useEditorStore();
  const { data: session } = useSession();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    if (!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    });
  }, [isEditing]);

  useEffect(() => {
    if (!canvas || !designId) return;
    markAsModified();
  }, [name, canvas, designId]);

  const handleExport = () => {
    if (userDesigns?.length >= 5 && !userSubscription.isPremium) {
      toast.error("Please upgrade to premium!", {
        description: "You need to upgrade to premium to create more designs",
      });

      return;
    }
    setShowExportModal(true);
  };

  return (
    <header className="header-gradient header flex flex-wrap items-center justify-between px-4 ">
<div className="flex items-center space-x-2  h-[20px] sm:h-[40px]
     order-1 w-[70%] sm:w-auto">


        <Link href={"/"}>
          <div className=" h-full sm:h-full w-[30px] sm:w-[100px]  m-0">
            <Image
            src="https://static.canva.com/web/images/856bac30504ecac8dbd38dbee61de1f1.svg"
            alt="canva"
            width={70}
            height={30}
            priority
          />
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild="true">
            <button className="header-button flex items-center text-white ">
              <span className="w-[30px] sm:w-[50px] text-[10px] sm:text-[15px] ">{isEditing ? "Editing" : "Viewing"}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editing</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditing(false)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Viewing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          className={
            "relative flex items-center justify-center w-3 sm:w-5 rounded-md hover:bg-muted transition-colors"
          }
          title={saveStatus !== "Saving..." ? "Save" : saveStatus}
          disabled={saveStatus === "Saving..."}
        >
          {saveStatus === "Saving..." ? (
            <div className="relative flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
              <span className="sr-only">Saving...</span>
            </div>
          ) : (
            <Save
              className={cn("h-5 w-5", saveStatus === "Saved" && "text-white")}
            />
          )}

          {saveStatus === "Saving..." && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </button>
        <button
          onClick={handleExport}
          className="header-button  relative "
          title="Export"
        >
          <Download className="w-3 sm:w-5 h-5" />
        </button>
      </div>
    <div className="flex-1 flex justify-center max-w-md 
     order-3 sm:order-2
     w-full sm:w-auto  h-[20px] sm:h-[40px]">


        <Input
          className="w-full h-6 sm:h-9 text-center"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
<div className="flex items-center space-x-3
     order-2 w-[30%] sm:w-auto  h-[20px] sm:h-[40px]">


        <button
          onClick={() => setShowPremiumModal(true)}
          className="upgrade-button flex items-center bg-white/10 hover:bg-white/20 text-white rounded-md h-9 px-3 transition-colors"
        >
          <Star className=" h-4 w-4 text-yellow-400" />
          <span className="text-[10px] sm:text-[15px]">
            {!userSubscription?.isPremium
              ? "Upgrade To Premium"
              : "Premium Member"}
          </span>
        </button>
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
      <ExportModal isOpen={showExportModal} onClose={setShowExportModal} />
    </header>
  );
}

export default Header;
