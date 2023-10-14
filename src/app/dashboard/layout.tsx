import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LucideIcon, UserPlus } from "lucide-react";

import { fetchRedis } from "@/lib/redis";
import { getUser } from "@/lib/user";
import FriendReqSidebar from "@/components/friend-req-sideabar";
import { Icons } from "@/components/icons";
import SignOutButton from "@/components/sign-out-button";

type LayoutProps = {
  children: React.ReactNode;
};

type SidebarOption = {
  id: number;
  name: string;
  href: string;
  icon: LucideIcon;
};

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    icon: UserPlus,
  },
];

export default async function DashboardLayout({ children }: LayoutProps) {
  const user = await getUser();

  if (!user) return notFound();

  const unseenReqCount = (
    (await fetchRedis(
      "smembers",
      `user:${user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.logo className="h-8 w-auto text-indigo-600" />
        </Link>

        <div className="text-xs font-semibold leading-6 text-gray-400">
          Your Chats
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>User Chats</li>

            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>

              <ul className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map(({ id, name, href, icon: Icon }) => (
                  <li key={id}>
                    <Link
                      href={href}
                      className="group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-secondary hover:text-indigo-600"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
                        <Icon className="h-4 w-4" />
                      </span>

                      <span className="truncate">{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="-mx-2 space-y-1">
              <FriendReqSidebar
                initialUnseenReqCount={unseenReqCount}
                sessionID={user.id}
              />
            </li>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 p-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-10 w-10 rounded-full bg-muted">
                  <Image
                    src={user.image ?? "https://i.pravatar.cc/50"}
                    alt={user.name ?? "User Image"}
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                </div>

                <span className="sr-only">Your Profile</span>

                <div className="flex flex-col">
                  <span aria-hidden className="truncate">
                    {user.name}
                  </span>

                  <span aria-hidden className="truncate text-xs text-zinc-400">
                    {user.email}
                  </span>
                </div>
              </div>

              <SignOutButton />
            </li>
          </ul>
        </nav>
      </div>

      {children}
    </div>
  );
}
