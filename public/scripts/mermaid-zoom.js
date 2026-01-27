// Click-to-zoom for Mermaid diagrams
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('svg[id^="mermaid"]').forEach((svg) => {
    svg.style.cursor = 'zoom-in';

    svg.addEventListener('click', (e) => {
      e.stopPropagation();

      // Check if there's already an expanded view
      const existingOverlay = document.getElementById('mermaid-zoom-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
        return;
      }

      // Create overlay container attached to body
      const overlay = document.createElement('div');
      overlay.id = 'mermaid-zoom-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 2rem;
        box-sizing: border-box;
      `;

      // Clone the SVG
      const svgClone = svg.cloneNode(true);
      svgClone.style.cssText = `
        max-width: 95%;
        max-height: 95%;
        width: auto;
        height: auto;
        background: #1a1d24;
        border: 1px solid #323846;
        border-radius: 12px;
        padding: 1.5rem;
        cursor: default;
      `;

      svgClone.addEventListener('click', (e) => e.stopPropagation());

      overlay.appendChild(svgClone);
      document.body.appendChild(overlay);

      // Close on overlay click
      overlay.addEventListener('click', () => overlay.remove());
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('mermaid-zoom-overlay')?.remove();
    }
  });
});
