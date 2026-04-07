class ParticleField {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.crmIcons = [];
        this.mouse = { x: 0, y: 0, radius: 200, isMoving: false };
        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.isMoving = true;

            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.mouse.isMoving = false;
            }, 100);
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.init();
    }

    drawCRMIcon(x, y, size, type, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = `rgba(55, 65, 81, ${opacity * 0.95})`;
        this.ctx.fillStyle = `rgba(55, 65, 81, ${opacity * 0.14})`;
        this.ctx.lineWidth = 2;

        switch (type) {
            case 'contact': {
                const w = size;
                const h = size * 0.72;
                this.ctx.beginPath();
                this.ctx.rect(x - w / 2, y - h / 2, w, h);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(x - w * 0.28, y - h * 0.08, h * 0.18, 0, Math.PI * 2);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(x - w * 0.05, y - h * 0.18);
                this.ctx.lineTo(x + w * 0.35, y - h * 0.18);
                this.ctx.moveTo(x - w * 0.05, y);
                this.ctx.lineTo(x + w * 0.35, y);
                this.ctx.moveTo(x - w * 0.05, y + h * 0.18);
                this.ctx.lineTo(x + w * 0.25, y + h * 0.18);
                this.ctx.stroke();
                break;
            }

            case 'pipeline': {
                const r = size * 0.12;
                const gap = size * 0.26;
                for (let i = 0; i < 4; i++) {
                    const cx = x - (gap * 1.5) + i * gap;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, y, r, 0, Math.PI * 2);
                    this.ctx.stroke();
                    if (i < 3) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(cx + r, y);
                        this.ctx.lineTo(cx + gap - r, y);
                        this.ctx.stroke();
                    }
                }
                this.ctx.beginPath();
                this.ctx.moveTo(x + gap * 1.5 - r * 0.2, y);
                this.ctx.lineTo(x + gap * 1.5 - r * 1.2, y - r * 0.8);
                this.ctx.moveTo(x + gap * 1.5 - r * 0.2, y);
                this.ctx.lineTo(x + gap * 1.5 - r * 1.2, y + r * 0.8);
                this.ctx.stroke();
                break;
            }

            case 'workflow': {
                const r = size * 0.12;
                const p1 = { x: x - size * 0.28, y: y - size * 0.15 };
                const p2 = { x: x + size * 0.28, y: y - size * 0.15 };
                const p3 = { x: x, y: y + size * 0.22 };
                [p1, p2, p3].forEach(p => {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                    this.ctx.stroke();
                });
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x + r, p1.y);
                this.ctx.lineTo(p2.x - r, p2.y);
                this.ctx.moveTo(p1.x + r * 0.4, p1.y + r * 0.8);
                this.ctx.lineTo(p3.x - r * 0.4, p3.y - r);
                this.ctx.moveTo(p2.x - r * 0.4, p2.y + r * 0.8);
                this.ctx.lineTo(p3.x + r * 0.4, p3.y - r);
                this.ctx.stroke();
                break;
            }

            case 'kanban': {
                const w = size;
                const h = size * 0.7;
                this.ctx.beginPath();
                this.ctx.rect(x - w / 2, y - h / 2, w, h);
                this.ctx.stroke();
                const colW = w / 3;
                for (let i = 1; i < 3; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x - w / 2 + colW * i, y - h / 2);
                    this.ctx.lineTo(x - w / 2 + colW * i, y + h / 2);
                    this.ctx.stroke();
                }
                for (let c = 0; c < 3; c++) {
                    const cx = x - w / 2 + colW * c + colW * 0.15;
                    const cy = y - h / 2 + h * 0.18;
                    this.ctx.beginPath();
                    this.ctx.rect(cx, cy, colW * 0.7, h * 0.12);
                    this.ctx.stroke();
                    this.ctx.beginPath();
                    this.ctx.rect(cx, cy + h * 0.2, colW * 0.5, h * 0.12);
                    this.ctx.stroke();
                }
                break;
            }

            case 'segment': {
                const r = size * 0.42;
                this.ctx.beginPath();
                this.ctx.arc(x, y, r, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x - r, y);
                this.ctx.lineTo(x + r, y);
                this.ctx.moveTo(x, y - r);
                this.ctx.lineTo(x, y + r);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(x + r * 0.35, y - r * 0.25, r * 0.08, 0, Math.PI * 2);
                this.ctx.arc(x - r * 0.3, y + r * 0.2, r * 0.08, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            }

            case 'tasks': {
                const w = size;
                const h = size * 0.7;
                this.ctx.beginPath();
                this.ctx.rect(x - w / 2, y - h / 2, w, h);
                this.ctx.stroke();
                for (let i = 0; i < 3; i++) {
                    const yy = y - h * 0.2 + i * h * 0.2;
                    this.ctx.beginPath();
                    this.ctx.rect(x - w * 0.35, yy - h * 0.05, w * 0.1, h * 0.1);
                    this.ctx.stroke();
                    this.ctx.beginPath();
                    this.ctx.moveTo(x - w * 0.2, yy);
                    this.ctx.lineTo(x + w * 0.35, yy);
                    this.ctx.stroke();
                }
                break;
            }

            case 'dashboard': {
                const w = size;
                const h = size * 0.68;
                this.ctx.beginPath();
                this.ctx.rect(x - w / 2, y - h / 2, w, h);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.rect(x - w * 0.35, y - h * 0.2, w * 0.28, h * 0.28);
                this.ctx.rect(x, y - h * 0.2, w * 0.35, h * 0.12);
                this.ctx.rect(x, y - h * 0.02, w * 0.35, h * 0.12);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x - w * 0.35, y + h * 0.2);
                this.ctx.lineTo(x - w * 0.2, y + h * 0.05);
                this.ctx.lineTo(x - w * 0.05, y + h * 0.14);
                this.ctx.lineTo(x + w * 0.12, y - h * 0.02);
                this.ctx.lineTo(x + w * 0.35, y + h * 0.1);
                this.ctx.stroke();
                break;
            }

            case 'kpi': {
                const r = size * 0.42;
                this.ctx.beginPath();
                this.ctx.arc(x, y, r, Math.PI, 0);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + r * 0.6, y - r * 0.3);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(x, y, r * 0.08, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            }

            case 'deal': {
                const w = size;
                const h = size * 0.5;
                this.ctx.beginPath();
                this.ctx.rect(x - w / 2, y - h / 2, w, h);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x - w * 0.15, y);
                this.ctx.lineTo(x + w * 0.15, y);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(x - w * 0.22, y, h * 0.22, -Math.PI / 2, Math.PI / 2);
                this.ctx.arc(x + w * 0.22, y, h * 0.22, Math.PI / 2, -Math.PI / 2);
                this.ctx.stroke();
                break;
            }

            case 'support': {
                const r = size * 0.28;
                this.ctx.beginPath();
                this.ctx.arc(x, y - r * 0.2, r, Math.PI, 0);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x - r, y - r * 0.2);
                this.ctx.lineTo(x - r, y + r * 0.35);
                this.ctx.moveTo(x + r, y - r * 0.2);
                this.ctx.lineTo(x + r, y + r * 0.35);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(x, y + r * 0.2, r * 0.08, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.moveTo(x + r * 0.1, y + r * 0.25);
                this.ctx.lineTo(x + r * 0.35, y + r * 0.35);
                this.ctx.stroke();
                break;
            }

            case 'integration': {
                const w = size * 0.8;
                const h = size * 0.38;
                this.ctx.beginPath();
                this.ctx.rect(x - w / 2, y - h / 2, w * 0.5, h);
                this.ctx.rect(x, y - h / 2, w * 0.5, h);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x - w * 0.05, y);
                this.ctx.lineTo(x + w * 0.05, y);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(x - w * 0.25, y, h * 0.22, 0, Math.PI * 2);
                this.ctx.arc(x + w * 0.25, y, h * 0.22, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
            }

            case 'automation': {
                this.ctx.beginPath();
                this.ctx.moveTo(x - size * 0.12, y - size * 0.45);
                this.ctx.lineTo(x + size * 0.1, y - size * 0.15);
                this.ctx.lineTo(x - size * 0.02, y - size * 0.15);
                this.ctx.lineTo(x + size * 0.12, y + size * 0.18);
                this.ctx.lineTo(x - size * 0.12, y + size * 0.05);
                this.ctx.lineTo(x + size * 0.02, y + size * 0.05);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(x - size * 0.35, y + size * 0.25, size * 0.08, 0, Math.PI * 2);
                this.ctx.arc(x + size * 0.35, y + size * 0.25, size * 0.08, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
            }
        }

        this.ctx.restore();
    }

    init() {
        this.particles = [];
        this.crmIcons = [];
        const particleCount = 40;
        const iconCount = 16;
        const iconTypes = ['contact', 'pipeline', 'workflow', 'kanban', 'segment', 'tasks', 'dashboard', 'kpi', 'deal', 'support', 'integration', 'automation'];

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;

            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.20 + 0.08
            });
        }

        const aspect = this.canvas.width / Math.max(1, this.canvas.height);
        const cols = Math.max(1, Math.ceil(Math.sqrt(iconCount * aspect)));
        const rows = Math.max(1, Math.ceil(iconCount / cols));
        const cellW = this.canvas.width / cols;
        const cellH = this.canvas.height / rows;
        const jitterX = cellW * 0.22;
        const jitterY = cellH * 0.22;
        const marginX = cellW * 0.18;
        const marginY = cellH * 0.18;

        for (let i = 0; i < iconCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const baseX = (col + 0.5) * cellW;
            const baseY = (row + 0.5) * cellH;
            const x = Math.max(marginX, Math.min(this.canvas.width - marginX, baseX + (Math.random() - 0.5) * 2 * jitterX));
            const y = Math.max(marginY, Math.min(this.canvas.height - marginY, baseY + (Math.random() - 0.5) * 2 * jitterY));

            this.crmIcons.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                size: Math.random() * 20 + 32,
                type: iconTypes[i % iconTypes.length],
                opacity: Math.random() * 0.22 + 0.34,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.012,
                bobPhase: Math.random() * Math.PI * 2,
                bobSpeed: Math.random() * 0.01 + 0.006
            });
        }
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            if (Math.random() < 0.01) {
                particle.vx += (Math.random() - 0.5) * 0.2;
                particle.vy += (Math.random() - 0.5) * 0.2;
            }
        });

        this.crmIcons.forEach(icon => {
            icon.x += icon.vx;
            icon.y += icon.vy;
            icon.rotation += icon.rotationSpeed;
            icon.bobPhase += icon.bobSpeed;
            icon.y += Math.sin(icon.bobPhase) * 0.18;
            icon.x += Math.cos(icon.bobPhase * 0.7) * 0.08;
            icon.vx *= 0.998;
            icon.vy *= 0.998;

            if (icon.x < -icon.size * 2) icon.x = this.canvas.width + icon.size * 2;
            if (icon.x > this.canvas.width + icon.size * 2) icon.x = -icon.size * 2;
            if (icon.y < -icon.size * 2) icon.y = this.canvas.height + icon.size * 2;
            if (icon.y > this.canvas.height + icon.size * 2) icon.y = -icon.size * 2;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.crmIcons.forEach(icon => {
            this.ctx.save();
            this.ctx.translate(icon.x, icon.y);
            this.ctx.rotate(icon.rotation);
            this.drawCRMIcon(0, 0, icon.size, icon.type, icon.opacity);
            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

function initBrandLogo() {
    const mark = document.getElementById('brandMark');
    const logo = document.getElementById('brandLogo');
    if (!mark || !logo) return;

    const skipRecolor = (logo.getAttribute('data-skip-recolor') || '').toLowerCase() === 'true';

    const setReady = () => {
        mark.classList.add('ready');
    };

    const recolorImageToTheme = (img) => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) return null;

        const c = document.createElement('canvas');
        const ctx = c.getContext('2d', { willReadFrequently: true });
        c.width = w;
        c.height = h;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const cornerSize = Math.max(8, Math.floor(Math.min(w, h) * 0.02));
        const sampleCornerRGB = (sx, sy) => {
            let rr = 0;
            let gg = 0;
            let bb = 0;
            let count = 0;
            for (let y = sy; y < sy + cornerSize; y++) {
                for (let x = sx; x < sx + cornerSize; x++) {
                    const i = (y * w + x) * 4;
                    const a = data[i + 3];
                    if (a === 0) continue;
                    rr += data[i];
                    gg += data[i + 1];
                    bb += data[i + 2];
                    count++;
                }
            }
            return count ? [rr / count, gg / count, bb / count] : [0, 0, 0];
        };

        const c1 = sampleCornerRGB(0, 0);
        const c2 = sampleCornerRGB(w - cornerSize, 0);
        const c3 = sampleCornerRGB(0, h - cornerSize);
        const c4 = sampleCornerRGB(w - cornerSize, h - cornerSize);
        const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
        const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
        const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

        const alphaMask = new Uint8ClampedArray(w * h);
        let maxDiff = 0;
        for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3];
            if (a === 0) continue;
            const dr = Math.abs(data[i] - bgR);
            const dg = Math.abs(data[i + 1] - bgG);
            const db = Math.abs(data[i + 2] - bgB);
            const diff = dr + dg + db;
            if (diff > maxDiff) maxDiff = diff;
        }
        const threshold = Math.max(6, Math.min(24, maxDiff * 0.08));
        const denom = Math.max(1, maxDiff - threshold);

        for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3];
            if (a === 0) {
                alphaMask[i / 4] = 0;
                continue;
            }
            const dr = Math.abs(data[i] - bgR);
            const dg = Math.abs(data[i + 1] - bgG);
            const db = Math.abs(data[i + 2] - bgB);
            const diff = dr + dg + db;
            const t = Math.max(0, Math.min(1, (diff - threshold) / denom));
            const eased = Math.pow(t, 0.65);
            alphaMask[i / 4] = Math.max(0, Math.min(255, Math.round(eased * 255)));
        }

        let x0 = w - 1;
        let y0 = h - 1;
        let x1 = 0;
        let y1 = 0;
        let found = false;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const v = alphaMask[y * w + x];
                if (v > 18) {
                    found = true;
                    if (x < x0) x0 = x;
                    if (y < y0) y0 = y;
                    if (x > x1) x1 = x;
                    if (y > y1) y1 = y;
                }
            }
        }
        if (!found) return null;

        const pad = Math.round(Math.min(w, h) * 0.02);
        x0 = Math.max(0, x0 - pad);
        y0 = Math.max(0, y0 - pad);
        x1 = Math.min(w - 1, x1 + pad);
        y1 = Math.min(h - 1, y1 + pad);

        const cw = Math.max(1, x1 - x0 + 1);
        const ch = Math.max(1, y1 - y0 + 1);
        const out = document.createElement('canvas');
        const octx = out.getContext('2d', { willReadFrequently: true });
        out.width = cw;
        out.height = ch;
        const outData = octx.createImageData(cw, ch);
        const od = outData.data;

        const stops = [
            { p: 0.0, c: [124, 58, 237] },
            { p: 0.55, c: [147, 51, 234] },
            { p: 1.0, c: [192, 132, 252] }
        ];
        const sample = (t) => {
            if (t <= 0) return stops[0].c;
            if (t >= 1) return stops[stops.length - 1].c;
            for (let i = 0; i < stops.length - 1; i++) {
                const a = stops[i];
                const b = stops[i + 1];
                if (t >= a.p && t <= b.p) {
                    const u = (t - a.p) / (b.p - a.p);
                    return [
                        Math.round(a.c[0] + (b.c[0] - a.c[0]) * u),
                        Math.round(a.c[1] + (b.c[1] - a.c[1]) * u),
                        Math.round(a.c[2] + (b.c[2] - a.c[2]) * u)
                    ];
                }
            }
            return stops[stops.length - 1].c;
        };

        for (let yy = 0; yy < ch; yy++) {
            for (let xx = 0; xx < cw; xx++) {
                const srcIdx = (y0 + yy) * w + (x0 + xx);
                const mask = alphaMask[srcIdx];
                const di = (yy * cw + xx) * 4;
                if (mask <= 12) {
                    od[di + 3] = 0;
                    continue;
                }
                const t = cw <= 1 ? 0.5 : xx / (cw - 1);
                const [rr, gg, bb] = sample(t);
                od[di] = rr;
                od[di + 1] = gg;
                od[di + 2] = bb;
                od[di + 3] = mask;
            }
        }
        octx.putImageData(outData, 0, 0);

        const maxW = 900;
        const scale = Math.min(1, maxW / out.width);
        const finalCanvas = document.createElement('canvas');
        const fctx = finalCanvas.getContext('2d');
        finalCanvas.width = Math.max(1, Math.round(out.width * scale));
        finalCanvas.height = Math.max(1, Math.round(out.height * scale));
        fctx.imageSmoothingEnabled = true;
        fctx.imageSmoothingQuality = 'high';
        fctx.drawImage(out, 0, 0, finalCanvas.width, finalCanvas.height);
        return finalCanvas.toDataURL('image/png');
    };

    const applyProcessedFromImg = (img) => {
        const dataUrl = recolorImageToTheme(img);
        if (!dataUrl) return false;
        logo.src = dataUrl;
        setReady();
        return true;
    };

    if (logo.complete && logo.naturalWidth > 0) {
        const src = (logo.getAttribute('src') || '').toLowerCase();
        if (skipRecolor) {
            setReady();
        } else if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg')) {
            applyProcessedFromImg(logo);
        } else {
            setReady();
        }
        return;
    }

    logo.addEventListener('load', () => {
        const src = (logo.getAttribute('src') || '').toLowerCase();
        if (skipRecolor) {
            setReady();
            return;
        }
        if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg')) {
            applyProcessedFromImg(logo);
            return;
        }
        setReady();
    });

    const preferredPng = logo.getAttribute('data-preferred-png');
    if (preferredPng && !skipRecolor) {
        const currentSrc = logo.getAttribute('src') || '';
        if (preferredPng === currentSrc) return;
        const probe = new Image();
        probe.decoding = 'async';
        probe.onload = () => {
            logo.src = preferredPng;
        };
        probe.src = preferredPng;
    }
}

class BackgroundBlobs {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blobs = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const blobCount = 5;

        for (let i = 0; i < blobCount; i++) {
            this.blobs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                baseX: Math.random() * this.canvas.width,
                baseY: Math.random() * this.canvas.height,
                radius: Math.random() * 200 + 100,
                color: i % 3 === 0 ? '59, 30, 111' : (i % 3 === 1 ? '106, 76, 255' : '184, 167, 255'),
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    update() {
        this.time += 0.01;

        this.blobs.forEach(blob => {
            const dx = this.mouse.x - blob.x;
            const dy = this.mouse.y - blob.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 300;

            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * 20;
                const angle = Math.atan2(dy, dx);
                blob.x -= Math.cos(angle) * force * 0.3;
                blob.y -= Math.sin(angle) * force * 0.3;
            }

            blob.x += (blob.baseX - blob.x) * 0.02;
            blob.y += (blob.baseY - blob.y) * 0.02;

            blob.baseX += blob.speedX;
            blob.baseY += blob.speedY;

            if (blob.baseX < -blob.radius || blob.baseX > this.canvas.width + blob.radius) {
                blob.speedX *= -1;
            }
            if (blob.baseY < -blob.radius || blob.baseY > this.canvas.height + blob.radius) {
                blob.speedY *= -1;
            }

            blob.phase += 0.02;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.blobs.forEach(blob => {
            const gradient = this.ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.radius
            );

            gradient.addColorStop(0, `rgba(${blob.color}, 0.15)`);
            gradient.addColorStop(0.5, `rgba(${blob.color}, 0.08)`);
            gradient.addColorStop(1, `rgba(${blob.color}, 0)`);

            this.ctx.fillStyle = gradient;

            this.ctx.beginPath();
            const points = 8;
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const wobble = Math.sin(angle * 3 + blob.phase) * 20;
                const r = blob.radius + wobble;
                const x = blob.x + Math.cos(angle) * r;
                const y = blob.y + Math.sin(angle) * r;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initBrandLogo();

    const crmImg = document.getElementById('crmShowcaseImg');
    const crmCaption = document.getElementById('crmShowcaseCaption');

    const slides = [
        {
            src: 'assets/crm-slide-1.svg',
            subtitle: 'Close deals faster with a clear pipeline.'
        },
        {
            src: 'assets/crm-slide-2.svg',
            subtitle: 'See every customer detail in one place.'
        },
        {
            src: 'assets/crm-slide-3.svg',
            subtitle: 'Automate follow-ups with smart workflows.'
        },
        {
            src: 'assets/crm-slide-4.svg',
            subtitle: 'Stay on top of calls, emails, and next steps.'
        },
        {
            src: 'assets/crm-slide-5.svg',
            subtitle: 'Celebrate wins and keep momentum going.'
        }
    ];

    const startCrmShowcase = () => {
        if (!crmImg) return;
        let idx = 0;
        let failCount = 0;

        const safeApply = (i) => {
            const s = slides[i];
            crmImg.src = s.src;
            if (crmCaption) crmCaption.textContent = s.subtitle;
        };

        const advance = () => {
            idx = (idx + 1) % slides.length;
            safeApply(idx);
        };

        crmImg.addEventListener('load', () => {
            failCount = 0;
        });

        crmImg.addEventListener('error', () => {
            failCount++;
            crmImg.classList.remove('fade-out');

            if (failCount >= slides.length) {
                failCount = 0;
                idx = 0;
                safeApply(idx);
                return;
            }

            advance();
        });

        const apply = (i) => {
            const s = slides[i];
            crmImg.src = s.src;
            if (crmCaption) crmCaption.textContent = s.subtitle;
        };

        apply(idx);

        setInterval(() => {
            crmImg.classList.add('fade-out');
            setTimeout(() => {
                idx = (idx + 1) % slides.length;
                apply(idx);
                crmImg.classList.remove('fade-out');
            }, 340);
        }, 3200);
    };

    startCrmShowcase();

    // ── DOM refs ───────────────────────────────────────────────────────────────
    const loginForm = document.getElementById('loginForm');
    const otpGroup = document.getElementById('otpGroup');
    const otpInput = document.getElementById('otp');
    const statusEl = document.getElementById('otpStatus');
    const btnTextEl = document.getElementById('loginBtnText');
    const changeEmailLink = document.getElementById('changeEmailLink');

    // ── Token helpers ──────────────────────────────────────────────────────────
    const TK = 'bezent_jwt';
    const getToken = () => localStorage.getItem(TK) || '';
    const setToken = t => localStorage.setItem(TK, t);

    // Already logged in — go straight to dashboard
    // if (getToken()) {
    //     window.location.replace('marketflow-crm.html');
    //     return;
    // }

    // ── State ──────────────────────────────────────────────────────────────────
    let otpSentTo = null;   // email OTP was dispatched to

    const resetToEmailStep = () => {
        otpSentTo = null;
        if (otpGroup) otpGroup.style.display = 'none';
        if (btnTextEl) btnTextEl.textContent = 'Send OTP';
        if (otpInput) otpInput.value = '';
        if (statusEl) statusEl.innerHTML = '';
        if (changeEmailLink) changeEmailLink.style.display = 'none';
        document.getElementById('email')?.focus();
    };

    if (changeEmailLink) {
        changeEmailLink.addEventListener('click', e => {
            e.preventDefault();
            resetToEmailStep();
        });
    }

    // Focus / blur floating-label behaviour for all inputs
    document.querySelectorAll('#loginForm input').forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => { if (!input.value) input.parentElement.classList.remove('focused'); });
        input.addEventListener('input', () => {
            input.parentElement.classList.toggle('has-value', Boolean(input.value));
        });
    });

    const setStatus = (html, color) => {
        if (!statusEl) return;
        statusEl.style.textAlign = 'left';
        statusEl.style.fontSize = '12px';
        statusEl.style.color = color || '#6B7280';
        statusEl.innerHTML = html;
    };

    // ── Submit handler ─────────────────────────────────────────────────────────
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const email = (emailInput?.value || '').trim();
        const button = loginForm.querySelector('.login-btn');

        if (!email) {
            setStatus('<span style="color:#b91c1c;">Please enter your email address.</span>');
            emailInput?.focus();
            return;
        }

        // ── STEP 1: no OTP sent yet → request one ─────────────────────────────
        if (!otpSentTo) {
            button.disabled = true;
            if (btnTextEl) btnTextEl.textContent = 'Sending…';
            setStatus('');

            try {
                const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (!res.ok) {
                    button.disabled = false;
                    if (btnTextEl) btnTextEl.textContent = 'Send OTP';
                    setStatus('<span style="color:#b91c1c;">' + (data.error || 'Failed to send OTP.') + '</span>');
                    return;
                }

                // OTP sent successfully
                otpSentTo = email;
                if (otpGroup) otpGroup.style.display = '';
                if (changeEmailLink) changeEmailLink.style.display = '';
                if (btnTextEl) btnTextEl.textContent = 'Verify OTP';
                button.disabled = false;

                setStatus(
                    '<span>OTP sent completely securely to <strong>' + email.replace(/</g, '&lt;') + '</strong>.<br>' +
                    '<span style="font-size:13px; color:#555;">Please check your inbox (and spam folder)</span></span>'
                );
                otpInput?.focus();

            } catch (_) {
                button.disabled = false;
                if (btnTextEl) btnTextEl.textContent = 'Send OTP';
                setStatus('<span style="color:#b91c1c;">Cannot reach server. Run <code>npm run server</code> first.</span>');
            }
            return;
        }

        // ── STEP 2: OTP already sent → verify it ─────────────────────────────
        const enteredOtp = String((otpInput?.value || '').trim());

        if (!enteredOtp) {
            setStatus('<span style="color:#b91c1c;">Please enter the OTP.</span>');
            otpInput?.focus();
            return;
        }

        // If email field changed reset and ask user to re-request
        if (email !== otpSentTo) {
            resetToEmailStep();
            setStatus('<span style="color:#b91c1c;">Email changed — please request a new OTP.</span>');
            return;
        }

        button.disabled = true;
        if (btnTextEl) btnTextEl.textContent = 'Verifying…';

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: enteredOtp })
            });
            const data = await res.json();

            if (!res.ok) {
                button.disabled = false;
                if (btnTextEl) btnTextEl.textContent = 'Verify OTP';
                setStatus('<span style="color:#b91c1c;">' + (data.error || 'Verification failed.') + '</span>');
                // If OTP expired, reset to step 1
                if (data.error && data.error.toLowerCase().includes('expired')) resetToEmailStep();
                return;
            }

            // ── Success ──────────────────────────────────────────────────────
            localStorage.clear();
            setToken(data.token);
            localStorage.setItem('bezent_user', JSON.stringify(data.user));
            if (btnTextEl) btnTextEl.textContent = 'Welcome!';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            setStatus('<span style="color:#059669;">Verified! Redirecting...</span>');

            setTimeout(() => {
                if (data.user.role === 'super_admin') {
                    window.location.replace('super-admin.html');
                } else if (data.user.role === 'admin') {
                    window.location.replace('admin.html');
                } else if (data.user.marketflow_access || data.user.projectflow_access) {
                    window.location.replace('marketflow-crm.html');
                } else {
                    window.location.replace('marketflow-crm.html'); // Let the guard reject them elegantly
                }
            }, 700);

        } catch (_) {
            button.disabled = false;
            if (btnTextEl) btnTextEl.textContent = 'Verify OTP';
            setStatus('<span style="color:#b91c1c;">Server error. Please try again.</span>');
        }
    });
});


