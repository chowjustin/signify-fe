"use client";

import withAuth from "@/components/hoc/withAuth";

export default withAuth(Dashboard, "user");
function Dashboard() {
  return <div>Ini Dashboard</div>;
}
