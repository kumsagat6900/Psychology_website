'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const regions: Record<string, string> = {
  KZ10: 'Abai',
  KZ11: 'Akmola',
  KZ15: 'Aktobe',
  KZ19: 'Almaty',
  KZ23: 'Atyrau',
  KZ27: 'West Kazakhstan',
  KZ31: 'Jambyl',
  KZ33: 'Jetisu',
  KZ35: 'Karaganda',
  KZ39: 'Kostanay',
  KZ43: 'Kyzylorda',
  KZ47: 'Mangystau',
  KZ55: 'Pavlodar',
  KZ59: 'North Kazakhstan',
  KZ61: 'Turkestan',
  KZ62: 'Ulytau',
  KZ63: 'East Kazakhstan',
  KZ71: 'Astana',
  KZ75: 'Almaty (city)',
  KZ79: 'Shymkent (city)',
};

export default function MapKazakhstan() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setHoveredRegion(regions[id]);
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Image
        src="/kz.svg"
        alt="Карта Казахстана"
        width={800}
        height={600}
        className="w-full h-auto"
      />
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 bg-black bg-opacity-70 text-white p-2 rounded"
        >
          {hoveredRegion}
        </motion.div>
      )}
    </div>
  );
}
