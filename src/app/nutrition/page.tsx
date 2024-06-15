import { getServerAuthSession } from "~/server/auth";
import { Nutrition } from "./_nutrition/Nutrition";


export default async function nutritionPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return <Nutrition />
};
