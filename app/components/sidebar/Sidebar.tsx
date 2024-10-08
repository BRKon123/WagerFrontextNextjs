"use client";
import Link from "next/link";
import {
  HeadPhonesSVG,
  HandShakeSVG,
  ProvidersSVG,
  GameShowsSVG,
  RouletteSVG,
  CardsSVG,
  PokerChipSVG,
  ControllerSVG,
  FocusSVG,
  SportsSVG,
  DiceSVG,
  BitcoinSVG,
  DollarSVG,
  BetSlipSVG,
} from "@/public/svgs/SVGComponents";
import MenuIcon from "@/public/svgs/menu-outline.svg";
import HomeIcon from "@/public/svgs/home-outline.svg";
import StarIcon from "@/public/svgs/star-outline.svg";
import RecentIcon from "@/public/svgs/time-outline.svg";
import SidebarLink from "./SidebarLink";
import clsx from "clsx";
import SidebarGroup from "./SidebarGroup"; // New import
import SidebarSearchBar from "./SidebarSearchBar";
import { usePathname } from "next/navigation"; // Add this import
import SidebarHeader from "./SidebarHeader"; // Add this import
import { useAuth } from "@/app/components/authentication/AuthContext";

interface SidebarProps {
  isExpanded: boolean; // controls whether sidebar is expanded
  toggleSidebar: () => void; // function to control the state that is passed to isExpanded
}

export default function Sidebar({ isExpanded, toggleSidebar }: SidebarProps) {
  const pathname = usePathname(); // Add this line to get the current path
  const isSportsActive = pathname.startsWith("/sports");
  const { user } = useAuth(); // Add this line to get the user

  return (
    <aside
      className={clsx(
        "bg-gray-800 text-white pb-2 px-2 transition-all duration-300",
        {
          "w-full lg:w-64": isExpanded, // takes whole width on smaller than medium
          "hidden lg:block lg:w-16": !isExpanded, // hidden on smaller than medium
        }
      )}
    >
      <SidebarHeader
        isExpanded={isExpanded}
        toggleSidebar={toggleSidebar}
        pathname={pathname}
      />

      <div className="mb-4">
        <SidebarSearchBar isExpanded={isExpanded} />
      </div>

      <ul className="flex flex-col gap-y-4">
        <SidebarGroup>
          <SidebarLink
            href="/"
            icon={<HomeIcon width={24} height={24} />}
            text="Home"
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
          <SidebarLink
            href="/favourites"
            icon={<StarIcon width={24} height={24} />}
            text="Favourites"
            disabled={!user}
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
          <SidebarLink
            href="/recents"
            icon={<RecentIcon width={24} height={24} />}
            text="Recents"
            disabled={!user}
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
          <SidebarLink
            href="/mybets"
            icon={<DollarSVG width={24} height={24} />}
            text="My Bets"
            disabled={!user}
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarLink
            href="/slots"
            icon={<CardsSVG width={24} height={24} />}
            text="Slots"
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
          <SidebarLink
            href="/live-casino"
            icon={<HeadPhonesSVG width={24} height={24} />}
            text="Live Casino"
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
          <SidebarLink
            href="/blackjack"
            icon={<HandShakeSVG width={24} height={24} />}
            text="Blackjack"
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
          <SidebarLink
            href="/roulette"
            icon={<RouletteSVG width={24} height={24} />}
            text="Roulette"
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
          <SidebarLink
            href="/game-shows"
            icon={<GameShowsSVG width={24} height={24} />}
            text="Game Shows"
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarLink
            href="/providers"
            icon={<ProvidersSVG width={24} height={24} />}
            text="Providers"
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
          />
        </SidebarGroup>
      </ul>

      {isExpanded && (
        <button className="mt-8 bg-primary w-full py-3 text-white rounded">
          BUY CRYPTO
        </button>
      )}
    </aside>
  );
}
