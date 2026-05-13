"use client";
import React from "react";
import Navbar from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import ScrollAnim from "@/components/common/ScrollAnim";
import Card from "@/components/card";
import {cardData} from "@/data/card_data";

export default function Materi() {
  return (
    <main>
      <ScrollAnim>
        <Navbar />
        <div className=" w-[99vw] p-32 h-screen items-center justify-center flex">
            
          <Card
            title={cardData[0].title}
            description={cardData[0].description}
            icon={cardData[0].icon}
            tag={cardData[0].tag}
            progress={cardData[0].progress}
            duration={cardData[0].duration}
            level={cardData[0].level }
          />
        </div>
        <Footer />
      </ScrollAnim>
    </main>
  );
}
