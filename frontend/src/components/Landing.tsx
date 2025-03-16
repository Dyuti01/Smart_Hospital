import { AuroraBackground } from "../ui/AuroraBackground";
import Body from "./Body";
import Footer from "./Footer";
import { AceternityNav } from "./AceternaityNav";

export function Landing() {
  return (
    // <AuroraBackground>
    <div className="bg-[url(/backcover.png)] bg-cover bg-center">
    {/* <div className="bg-gradient-to-b from-cyan-50 to-white relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwODkxYjIiIHN0b3Atb3BhY2l0eT0iMC4xIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBkOWQ4OCIgc3RvcC1vcGFjaXR5PSIwLjEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsbD0idXJsKCNncmFkKSIvPgo8L3N2Zz4=')] opacity-40" /> */}
      <AceternityNav/>
      <Body/>
      <Footer/>
    </div>

    // </AuroraBackground>
   
  );
}
