"use client";
import React from "react";
import Navbar from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import ScrollAnim from "@/components/common/ScrollAnim";
import Carousel from "@/components/Carousel";
import { cardData } from "@/data/card_data";

export default function Materi() {
  return (
    <main>
      <ScrollAnim>
        <Navbar />
        <Carousel items={cardData} />
        <Footer />
      </ScrollAnim>
    </main>
  );
}
