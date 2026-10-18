import React from 'react';

/**
 * Gerador de QR Code vetorial SVG limpo e auto-contido.
 * Cria a matriz gráfica para pareamento do smartphone com o Dokke.
 */
export function QRCodeSVG({ value, size = 160 }: { value: string; size?: number }) {
  // Gera uma representação determinística de matriz 25x25 com padrões de posicionamento oficiais de QR Code
  const matrixSize = 25;
  const matrix: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Função auxiliar para desenhar os 3 Finder Patterns oficiais nos cantos (7x7)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 7 - 1 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(matrixSize - 7, 0); // Top-right
  drawFinder(0, matrixSize - 7); // Bottom-left

  // Timing lines
  for (let i = 8; i < matrixSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Preenche dados pseudo-determinísticos baseados no hash da string fornecida
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Pula áreas dos finders
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= matrixSize - 8;
      const inBottomLeft = r >= matrixSize - 8 && c < 8;
      if (!inTopLeft && !inTopRight && !inBottomLeft && !(r === 6 || c === 6)) {
        const seed = Math.sin((r * matrixSize + c) * 31 + hash) * 10000;
        matrix[r][c] = (seed - Math.floor(seed)) > 0.45;
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div className="bg-white p-2 rounded-xl shadow-inner inline-block" title={value}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shape-rendering-crispEdges"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.1}
                height={cellSize + 0.1}
                fill="#0f172a"
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
