"use client"

import React from "react"
import { LogOut, User, MapPin } from "lucide-react"
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
  backgroundGradient?: string;
  onLocationSelect?: (lat: number, lon: number) => void;
}

function SidebarContents({ onLocationSelect }: { onLocationSelect?: (lat: number, lon: number) => void }) {
  const { user, isSignedIn } = useUser()
  const { state } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        {isSignedIn && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <MapPin className="mr-2" />
              {isExpanded && "Saved Locations"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SavedLocations onLocationSelect={onLocationSelect || (() => {})} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                  <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                {isExpanded && (
                  <span className="ml-2">{user?.fullName}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <SignOutButton>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SignInButton mode="modal">
            <Button variant="ghost" className="w-full justify-start">
              <User className="h-4 w-4" />
              {isExpanded && (
                <span className="ml-2">Sign in</span>
              )}
            </Button>
          </SignInButton>
        )}
      </SidebarFooter>
    </>
  )
}

export function AppSidebar({ backgroundGradient, onLocationSelect }: AppSidebarProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar 
        collapsible="icon"
        className={`${backgroundGradient ? backgroundGradient + ' ' : 'bg-black'} bg-opacity-10 transition-all duration-500`}
      >
        <SidebarContents onLocationSelect={onLocationSelect} />
      </Sidebar>
    </SidebarProvider>
  )
}
