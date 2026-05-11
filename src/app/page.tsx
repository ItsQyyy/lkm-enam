"use client"

import Navbar from "@/components/ui/NavBar";
import HeroSection from "@/components/home/HeroSection";
import Quotes from "@/components/home/Quotes";
import Group from "@/components/home/Group";
import Team from "@/components/home/Team";
import ScrollAnim from "@/components/common/ScrollAnim";

export default function Home() {
  return (
    <main>
      <ScrollAnim >
        <Navbar />
        <HeroSection />
        <Quotes />
        <Group />
        <Team />
      </ScrollAnim>

    </main>
  )
}