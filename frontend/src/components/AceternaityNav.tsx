"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/NavbarMenu";
import { cn } from "../lib/utils";
import CusLink from "./CusLink";
import { Stethoscope } from "lucide-react";
import { SidebarComponent } from "./SidebarComponent";
import HamburgerMenu from "./HamburgerMenu";
import { useAuth } from "../utils/AuthContext";
import { Button } from "../ui/patientProfile/button";
import axios from "axios";
import { toast } from "../ui/patientProfile/use-toast";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../config";

export function AceternityNav({ className }: { className?: string }) {
  return (
    <div className={"relative w-full flex items-center justify-center" + " " + className}>
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const auth = useAuth();

  const [active, setActive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post(`${BACKEND_URL}/api/v1/auth/logout`, {}, { withCredentials: true });
      toast({
        title: "Logout successfully",
        description: `You are logged out.`,
        variant: "success",
        duration: 5000
      })
      auth.logout();
      setIsLoggingOut(false);
      navigate('/doctorsList')
    } catch (err: any) {
      toast({
        title: "Something wrong",
        description: `Try again later. ${err}`,
        variant: "destructive",
        duration: 5000
      })
      setIsLoggingOut(false);
    }
  }
  return (
    <div
      className={cn("fixed inset-x-0 max-w-screen mx-[20px] mt-[10px] z-50", className)}
    >
      <Menu setActive={setActive}>
        <CusLink to='/' className="flex gap-[5px] items-center justify-center text-white hover:cursor-pointer" >
          <Stethoscope className="text-cyan-600" />
          <span className="text-xl text-gray-900 poppins-regular dark:text-white">smartClinic</span>
        </CusLink>
        {/* <SidebarComponent/> */}
        <HamburgerMenu />
        <div className="hidden md:flex gap-[20px] items-center justify-center">
          {/* <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem> */}
          {/* <MenuItem setActive={setActive} active={active} item="Products">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem> */}
          {/* <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem> */}
          <CusLink to='/' className=' h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>Home</CusLink>
          <CusLink to='/doctorsList' className=' h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>Doctors</CusLink>
          {!auth.isAuthenticated && <CusLink to='/signin' className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>Signin</CusLink>}
          {!auth.isAuthenticated && <CusLink to='/signup' className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>Create account</CusLink>}
          {(auth.isAuthenticated && auth.user?.role!=="Admin") && <CusLink to={`/${auth.user?.role.toLowerCase()}_profile`} className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>Welcome, {auth.user?.fullName.split(' ')[0]}</CusLink>}
          {(auth.isAuthenticated && auth.user?.role==="Admin") && <div className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>Welcome, {auth.user?.fullName.split(' ')[0]}</div>
          }

{auth.user?.role==="Admin" && <CusLink to={`/admin/userManage`} className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>User manage</CusLink>}

          {(auth.isAuthenticated && auth.user?.role!=="Admin") && <CusLink to={`/${auth.user?.role.toLowerCase()}_profile`} className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>Profile</CusLink>}
          {auth.isAuthenticated && <Button onClick={handleLogout} className='text-white bg-gradient-to-r from-cyan-700 to-teal-600'>
            {!isLoggingOut && "Logout"}
            {isLoggingOut &&
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin mr-2" />
                Logging out...
              </div>
            }
          </Button>}
          {/* <CusLink to='/doctor_profile' className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>DctrProfile</CusLink>
        <CusLink to='/doctor_profile_public' className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>DctrProfile</CusLink>
        <CusLink to='/patient_profile' className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>PtntProfile</CusLink>
        <CusLink to='/paymentSuccess' className='h-[full] hover:text-blue-500 hover:cursor-pointer transition-all ease-in-out dark:text-white'>PaymentSuccess</CusLink> */}
        </div>
      </Menu>
    </div>
  );
}
