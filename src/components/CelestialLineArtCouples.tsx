import React, { useEffect, useRef, useState } from 'react';

/**
 * Flood-fills enclosed regions, then runs connected-component analysis
 * to find their sizes. Only SMALL regions (flower petal size) get colored.
 * Leaves, faces, and bodies are large regions — they are skipped entirely.
 */
export const CelestialLineArtCouples: React.FC = () => {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);
  const [baseVisible, setBaseVisible] = useState(false);
  const [colorVisible, setColorVisible] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/couple-lineart.jpg';

    img.onload = () => {
      const baseCanvas = baseCanvasRef.current;
      const colorCanvas = colorCanvasRef.current;
      if (!baseCanvas || !colorCanvas) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      baseCanvas.width = w;
      baseCanvas.height = h;
      colorCanvas.width = w;
      colorCanvas.height = h;

      const baseCtx = baseCanvas.getContext('2d');
      const colorCtx = colorCanvas.getContext('2d');
      if (!baseCtx || !colorCtx) return;

      baseCtx.drawImage(img, 0, 0);
      const raw = baseCtx.getImageData(0, 0, w, h);
      const src = raw.data;

      // ── Build brightness map ──
      const DARK_THRESH = 100;
      const bright = new Float32Array(w * h);
      for (let i = 0; i < src.length; i += 4) {
        bright[i / 4] = (src[i] + src[i + 1] + src[i + 2]) / 3;
      }

      // ── PASS 1: Flood-fill from edges → mark background dark pixels ──
      const isBg = new Uint8Array(w * h);
      const stack: number[] = [];

      const seed = (idx: number) => {
        if (idx >= 0 && idx < w * h && !isBg[idx] && bright[idx] < DARK_THRESH) {
          isBg[idx] = 1;
          stack.push(idx);
        }
      };
      for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
      for (let y = 1; y < h - 1; y++) { seed(y * w); seed(y * w + w - 1); }

      while (stack.length > 0) {
        const idx = stack.pop()!;
        const x = idx % w;
        const y = Math.floor(idx / w);
        if (x > 0)     seed(idx - 1);
        if (x < w - 1) seed(idx + 1);
        if (y > 0)     seed(idx - w);
        if (y < h - 1) seed(idx + w);
      }

      // ── PASS 2: Connected components on enclosed pixels ──
      // Measure size of each enclosed region — flowers are SMALL, faces/leaves are LARGE
      const compId = new Int32Array(w * h).fill(-1);
      const compSizes: number[] = [];
      // Store centroid x,y per component to assign colors
      const compSumX: number[] = [];
      const compSumY: number[] = [];
      const compMinX: number[] = [];
      const compMaxX: number[] = [];
      const compMinY: number[] = [];
      const compMaxY: number[] = [];

      for (let i = 0; i < bright.length; i++) {
        if (bright[i] >= DARK_THRESH || isBg[i] || compId[i] >= 0) continue;

        const id = compSizes.length;
        compSizes.push(0);
        compSumX.push(0);
        compSumY.push(0);
        compMinX.push(w); compMaxX.push(0);
        compMinY.push(h); compMaxY.push(0);

        const bfsStack = [i];
        compId[i] = id;

        while (bfsStack.length > 0) {
          const idx = bfsStack.pop()!;
          compSizes[id]++;
          const px = idx % w;
          const py = Math.floor(idx / w);
          compSumX[id] += px;
          compSumY[id] += py;
          if (px < compMinX[id]) compMinX[id] = px;
          if (px > compMaxX[id]) compMaxX[id] = px;
          if (py < compMinY[id]) compMinY[id] = py;
          if (py > compMaxY[id]) compMaxY[id] = py;

          const x = idx % w;
          const y = Math.floor(idx / w);
          const neighbors = [
            x > 0     ? idx - 1 : -1,
            x < w - 1 ? idx + 1 : -1,
            y > 0     ? idx - w : -1,
            y < h - 1 ? idx + w : -1,
          ];
          for (const nidx of neighbors) {
            if (nidx >= 0 && bright[nidx] < DARK_THRESH && !isBg[nidx] && compId[nidx] < 0) {
              compId[nidx] = id;
              bfsStack.push(nidx);
            }
          }
        }
      }

      // ── Flower petal size range ──
      // Flower petals = small, compact regions
      // Leaves = elongated (high aspect ratio bounding box)
      // Faces/bodies = large regions
      const MIN_PETAL = 40;
      const MAX_PETAL = 700; // reduced — larger regions are leaves/faces
      const MAX_ASPECT = 2.2; // petals are compact; leaves/vines are elongated

      // Centroid-based colors per component
      const CHERRY = { r: 210, g: 25,  b: 55  };
      const BLUE   = { r: 40,  g: 130, b: 240  };
      const YELLOW = { r: 255, g: 200, b: 20   };

      // Pre-compute color for each component based on centroid position
      const compColor = compSizes.map((size, id) => {
        if (size < MIN_PETAL || size > MAX_PETAL) return null;

        // Check bounding box aspect ratio — skip elongated shapes (leaves, vines)
        const bw = compMaxX[id] - compMinX[id] + 1;
        const bh = compMaxY[id] - compMinY[id] + 1;
        const aspect = Math.max(bw, bh) / Math.max(1, Math.min(bw, bh));
        if (aspect > MAX_ASPECT) return null; // too elongated = leaf/vine

        const cx = (compSumX[id] / size) / w;
        const cy = (compSumY[id] / size) / h;

        // Skip the entire couple area (center of image, from mid-height down)
        if (cx > 0.22 && cx < 0.78 && cy > 0.28) return null;
        // Also skip head/face area (upper center)
        if (cx > 0.32 && cx < 0.68 && cy > 0.20) return null;

        // Top arch → cherry red and blue alternating
        if (cy < 0.22) return cx < 0.5 ? CHERRY : BLUE;
        // Far left/right cascades → mix of all three
        if (cx < 0.22 || cx > 0.78) {
          const band = Math.floor(cy * 10) % 3;
          return band === 0 ? CHERRY : band === 1 ? BLUE : YELLOW;
        }
        // Upper mid arch flowers → cherry and yellow
        if (cy < 0.40) return cx < 0.45 ? CHERRY : YELLOW;
        // Default lower flowers
        return YELLOW;
      });

      // ── PASS 3: Build base canvas (white outlines, transparent background) ──
      const baseImageData = baseCtx.createImageData(w, h);
      const bData = baseImageData.data;
      for (let i = 0; i < bright.length; i++) {
        const pi = i * 4;
        if (bright[i] >= DARK_THRESH) {
          const alpha = Math.min(255, ((bright[i] - DARK_THRESH) / (255 - DARK_THRESH)) * 255);
          bData[pi] = 255; bData[pi+1] = 255; bData[pi+2] = 255; bData[pi+3] = alpha;
        }
        // else transparent (default 0s)
      }
      baseCtx.putImageData(baseImageData, 0, 0);

      // ── PASS 4: Build color canvas (only flower petal interiors) ──
      const colorImageData = colorCtx.createImageData(w, h);
      const cData = colorImageData.data;

      for (let i = 0; i < bright.length; i++) {
        const pi = i * 4;
        const id = compId[i];

        // Only paint enclosed pixels that belong to a flower-sized component
        if (id < 0 || compColor[id] === null) {
          // background, outline, or non-petal region → transparent on color layer
          cData[pi] = 0; cData[pi+1] = 0; cData[pi+2] = 0; cData[pi+3] = 0;
          continue;
        }

        const col = compColor[id]!;
        cData[pi]   = col.r;
        cData[pi+1] = col.g;
        cData[pi+2] = col.b;
        cData[pi+3] = 210; // slightly transparent so the green bg blends through subtly
      }
      colorCtx.putImageData(colorImageData, 0, 0);

      // Fade: white outlines first, then petal colors bloom slowly
      setTimeout(() => {
        setBaseVisible(true);
        setTimeout(() => setColorVisible(true), 2800);
      }, 300);
    };
  }, []);

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(820px, 100vmin)',
    height: 'min(820px, 100vmin)',
    objectFit: 'contain',
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Layer 1: Pure white outlines */}
      <canvas ref={baseCanvasRef} aria-hidden="true"
        style={{ ...canvasStyle, opacity: baseVisible ? 0.75 : 0, transition: 'opacity 3s cubic-bezier(0.22, 0, 0.38, 1)' }}
      />
      {/* Layer 2: Colored petal interiors only */}
      <canvas ref={colorCanvasRef} aria-hidden="true"
        style={{ ...canvasStyle, opacity: colorVisible ? 1 : 0, transition: 'opacity 7s ease-in-out' }}
      />
    </div>
  );
};
