"use client"

import React, { useState } from "react"
import { LogIn, User, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
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

interface AppSidebarProps {
  backgroundGradient?: string;
}

export function AppSidebar({ backgroundGradient }: AppSidebarProps) {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null)

  const handleLogin = () => {
    setUser({ name: "John Doe", avatar: "/path/to/avatar.jpg" })
  }

  const handleRegister = () => {
    // Implement your registration logic here
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar 
        collapsible="icon"
        className={`${backgroundGradient ? backgroundGradient + ' ' : 'bg-black'} bg-opacity-10 transition-all duration-500`}
      >
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          {/* Empty content section - required for structure */}
        </SidebarContent>
        <SidebarFooter>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="w-full justify-start" onClick={handleRegister}>
                <User className="mr-2 h-4 w-4" />
              </Button>
            </>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
