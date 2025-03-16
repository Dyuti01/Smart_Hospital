import { useState } from "react"
import { Menu, X } from "lucide-react"
import CusLink from "./CusLink"



export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Signin", href: "/signin" },
    { name: "Create account", href: "/signup" },
    { name: "Profile", href: "/profile" },
  ]

  return (
    <div className="relative h-full md:hidden">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="z-50 flex items-center px-3 text-gray-200 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-black" />
        </button>
      )}

      <div
        className={`absolute right-0 top-[-25px] w-64 transform rounded-md bg-white opacity-95 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none right-[-70px]"
        }`}
      >
        <div className="p-4">
          <nav className="flex justify-between">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <CusLink
                    to={item.href}
                    className="block text-base font-medium hover:text-gray-400 py-2 hover:cursor-pointer"
                    // onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </CusLink>
                </li>
              ))}
            </ul>
            <div className="flex flex-col">
            {/* <h2 className="text-xl font-bold text-white">Menu</h2> */}
            <button onClick={() => setIsOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  )
}

