import Header from "./headerss";
import {Outlet} from "react-router-dom";
import AvatarProfileInfo from "./AvatarProfileInfo";

export default function Layout() {
  return (
    <main> 
      <Header />
      <Outlet />
      <AvatarProfileInfo/>
    </main>
  );
}