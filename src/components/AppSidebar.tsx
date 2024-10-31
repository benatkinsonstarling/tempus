"use client"

import React from "react"
import { LogOut, User, MapPin, Menu } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { SavedLocations } from "./SavedLocations"

interface AppSidebarProps {
  backgroundGradient: string;
  onLocationSelect: (lat: number, lon: number, locationName: string) => void;
  onLocationSaved: () => void;
}

export function AppSidebar({ backgroundGradient, onLocationSelect, onLocationSaved }: AppSidebarProps) {
  const { isSignedIn, user } = useUser();

  return (
    <SidebarProvider>
      <Sidebar defaultCollapsed={true}>
        <SidebarTrigger className="fixed top-4 left-4 z-50">
          <Menu className="h-4 w-4" />
        </SidebarTrigger>
        
        <SidebarHeader className="border-none">
          <div className="p-4">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SignOutButton>
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </div>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignInButton>
                <Button variant="ghost" className="w-full">Sign In</Button>
              </SignInButton>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className={`${backgroundGradient || 'bg-gradient-to-b from-blue-400 to-blue-600'} flex-1 transition-all duration-500`}>
          {isSignedIn && (
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Saved Locations
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SavedLocations 
                  onLocationSelect={onLocationSelect} 
                  onLocationSaved={onLocationSaved}
                />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
