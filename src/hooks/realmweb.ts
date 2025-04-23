import { useEffect, useState } from "react";
import * as Realm from "realm-web";

export function useApp() {
  const [app, setApp] = useState<Realm.App | null>(null);
  // Run in useEffect so that App is not created in server-side environment
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ID) {
      setApp(Realm.getApp(process.env.NEXT_PUBLIC_APP_ID));
    } else {
      console.error("NEXT_PUBLIC_APP_ID is not defined");
    }
  }, []);
  return app;
}

