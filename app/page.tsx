"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import Inventory from "@/components/Inventory";

export default function Home() {
  return (
    <Authenticator>
      {({ signOut }) => <Inventory onSignOut={signOut} />}
    </Authenticator>
  );
}