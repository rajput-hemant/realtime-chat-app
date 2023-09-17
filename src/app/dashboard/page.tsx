import { getUser } from "@/lib/user";

export default async function Dashboard() {
  const user = await getUser();

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}
