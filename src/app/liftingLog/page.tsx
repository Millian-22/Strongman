import { getServerAuthSession } from "~/server/auth";
import { LiftingLog } from "./_liftingLog/LiftingLog";


export default async function LiftingLogPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
  <>
    <div>Logged in as {session?.user.email}</div>
    <LiftingLog />
  </>
  )
}