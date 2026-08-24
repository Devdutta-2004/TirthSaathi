import React, { useEffect, useRef, useState, useMemo } from 'react';
import { calculateHaversineDistance, calculateCompassBearing } from '../../services/geoService';
import { MapPin, Navigation, Crosshair, ZoomIn, ZoomOut, Compass, Battery, RefreshCw } from 'lucide-react';

/**
 * Web Mercator Projection Formulas
 * Converts (latitude, longitude) <-> (tile X, tile Y, pixel coordinates)
 */
function latLngToWorldPixel(lat, lng, zoom) {
  const latRad = (lat * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * n * 256;
  const y =
    (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n * 256;
  return { x, y };
}

export const LiveGPSMap = ({
  myCoords,
  myAccuracy = 10,
  myHeading = 0,
  members = [],
  selectedMember = null,
  onSelectMember = null
}) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState(myCoords || { lat: 25.3109, lng: 83.0107 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update center if myCoords changes and user hasn't panned far
  useEffect(() => {
    if (myCoords) {
      setCenter(myCoords);
    }
  }, [myCoords]);

  // Calculate visible tiles for OpenStreetMap
  const { tiles, centerWorldPx } = useMemo(() => {
    const centerPx = latLngToWorldPixel(center.lat, center.lng, zoom);
    const width = 800; // estimated canvas width
    const height = 450; // estimated canvas height

    const startTileX = Math.floor((centerPx.x - width / 2) / 256);
    const endTileX = Math.floor((centerPx.x + width / 2) / 256);
    const startTileY = Math.floor((centerPx.y - height / 2) / 256);
    const endTileY = Math.floor((centerPx.y + height / 2) / 256);

    const tileList = [];
    const maxTile = Math.pow(2, zoom);

    for (let x = startTileX; x <= endTileX; x++) {
      for (let y = startTileY; y <= endTileY; y++) {
        if (y >= 0 && y < maxTile) {
          const wrappedX = ((x % maxTile) + maxTile) % maxTile;
          const left = x * 256 - centerPx.x + width / 2;
          const top = y * 256 - centerPx.y + height / 2;
          tileList.push({
            key: `${zoom}-${wrappedX}-${y}`,
            url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
            left,
            top
          });
        }
      }
    }

    return { tiles: tileList, centerWorldPx: centerPx };
  }, [center, zoom]);

  // Helper to convert any GPS point to screen pixel (X, Y)
  const getScreenCoords = (lat, lng) => {
    if (!lat || !lng) return { x: 400, y: 225 };
    const pt = latLngToWorldPixel(lat, lng, zoom);
    const x = pt.x - centerWorldPx.x + 400 + panOffset.x;
    const y = pt.y - centerWorldPx.y + 225 + panOffset.y;
    return { x, y };
  };

  // Drag handling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Center on my GPS
  const handleCenterOnMe = () => {
    if (myCoords) {
      setCenter(myCoords);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const myScreenPos = getScreenCoords(myCoords?.lat, myCoords?.lng);
  const selectedScreenPos = selectedMember?.coords
    ? getScreenCoords(selectedMember.coords.lat, selectedMember.coords.lng)
    : null;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[420px] rounded-3xl overflow-hidden border border-slate-300 shadow-inner select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } bg-[#e8e0d8]`}
    >
      {/* 1. RENDER OPENSTREETMAP TILES */}
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
      >
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt="OpenStreetMap"
            loading="lazy"
            className="absolute w-[256px] h-[256px] pointer-events-none opacity-90 transition-opacity duration-300"
            style={{
              left: `${tile.left}px`,
              top: `${tile.top}px`
            }}
          />
        ))}
      </div>

      {/* 2. SVG LAYER FOR ACCURACY RADIUS CIRCLE & WALKING PATH */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {/* My Accuracy Radius Circle */}
        {myScreenPos && (
          <circle
            cx={myScreenPos.x}
            cy={myScreenPos.y}
            r={Math.max(16, myAccuracy * 1.5)}
            fill="#0E5ABF"
            fillOpacity="0.12"
            stroke="#0E5ABF"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Dotted Walking Path Line to Selected Member */}
        {myScreenPos && selectedScreenPos && (
          <line
            x1={myScreenPos.x}
            y1={myScreenPos.y}
            x2={selectedScreenPos.x}
            y2={selectedScreenPos.y}
            stroke="#F59E0B"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* 3. PEER SMARTPHONE MARKERS (Family Members) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {members.map((member) => {
          if (!member.coords) return null;
          const pos = getScreenCoords(member.coords.lat, member.coords.lng);
          const isSelected = selectedMember && (selectedMember.deviceId === member.deviceId || selectedMember.id === member.id);
          const distance = myCoords
            ? calculateHaversineDistance(myCoords.lat, myCoords.lng, member.coords.lat, member.coords.lng)
            : member.distanceMeters || 0;

          return (
            <div
              key={member.deviceId || member.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectMember && onSelectMember(member);
              }}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110"
            >
              {isSelected && (
                <div className="w-14 h-14 rounded-full bg-cyan-400/40 animate-ping absolute -top-2 -left-2 pointer-events-none" />
              )}
              <div
                className={`px-2 py-1 rounded-2xl flex items-center gap-1.5 text-xs font-bold shadow-glow border transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-navy-950 ring-2 ring-cyan-400 shadow-glow'
                    : 'bg-[#051126]/90 text-white border-cyan-500/40 backdrop-blur-md'
                }`}
              >
                {/* Photo Avatar */}
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/60 flex-shrink-0">
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] font-mono whitespace-nowrap">{member.name ? member.name.split(' ')[0] : 'Node'}</span>
                {distance > 0 && (
                  <span className="text-[9px] font-mono opacity-85">({distance}m)</span>
                )}
              </div>
            </div>
          );
        })}

        {/* 4. MY PHYSICAL DEVICE PULSING MARKER */}
        {myScreenPos && (
          <div
            style={{
              left: `${myScreenPos.x}px`,
              top: `${myScreenPos.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute pointer-events-none flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-400/40 animate-ping absolute -top-2" />
            <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-white shadow-glow flex items-center justify-center text-navy-950 font-bold">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
            <span className="bg-[#030914] text-cyan-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full mt-1 border border-cyan-500/40 shadow-sm whitespace-nowrap">
              HOST (YOU)
            </span>
          </div>
        )}
      </div>

      {/* 5. FLOATING MAP CONTROLS */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
        <button
          onClick={handleCenterOnMe}
          className="p-2.5 rounded-2xl bg-[#051126]/90 hover:bg-[#081b3d] text-cyan-300 border border-cyan-500/40 shadow-glow transition-colors"
          title="Center on My Live GPS"
        >
          <Crosshair className="w-4 h-4 text-cyan-400" />
        </button>

        <div className="flex flex-col rounded-2xl overflow-hidden border border-cyan-500/40 shadow-glow bg-[#051126]/90 backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(19, z + 1))}
            className="p-2.5 hover:bg-[#081b3d] text-cyan-300 border-b border-cyan-500/20 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(12, z - 1))}
            className="p-2.5 hover:bg-[#081b3d] text-cyan-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6. BOTTOM TELEMETRY BAR */}
      <div className="absolute bottom-3 left-3 z-30 bg-[#030914]/90 text-white px-3 py-1.5 rounded-xl text-[11px] font-mono backdrop-blur-md border border-cyan-500/40 flex items-center gap-2 shadow-glow">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-cyan-300">GPS ACCURACY: ±{myAccuracy}m</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400">ZOOM {zoom}x</span>
      </div>
    </div>
  );
};
