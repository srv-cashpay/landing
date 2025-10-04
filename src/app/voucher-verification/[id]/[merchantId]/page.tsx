import dynamic from "next/dynamic";

const VoucherVerification = dynamic(() => import("./VoucherVerification"), { ssr: false });

export default function Page() {
  return <VoucherVerification />;
}
