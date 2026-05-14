"use client";

import Navbar from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import ScrollAnim from "@/components/common/ScrollAnim";
import { MateriHero } from "@/components/materi/materiHero";
import { FilterBar } from "@/components/materi/filterBar";
import { MateriCard } from "@/components/materi/materiCard";
import { materiList } from "./data/materilist";

export default function MateriPage() {
  return (
    <main className="min-h-screen bg-white">
      <ScrollAnim>
        <Navbar />

        <MateriHero items={materiList} />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <FilterBar />

        <section className="px-6 md:px-16 pb-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {materiList.map((item, i) => (
              <MateriCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>

        <Footer />
      </ScrollAnim>
    </main>
  );
}