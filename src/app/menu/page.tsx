import dynamic from "next/dynamic";

const MenuMakan = dynamic(() => import("./MenuMakan"), { ssr: false });

export default function Page() {
  return <MenuMakan />;
}
