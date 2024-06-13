import { getServerAuthSession } from "~/server/auth";
import { LiftingLog } from "./liftingLog/LiftingLog";


export default async function LiftingLogPage() {
  const session = await getServerAuthSession();
  // console.log('is this expiring');
  if (!session?.user) return null;

  // console.log('session', session);


  return <LiftingLog />
}