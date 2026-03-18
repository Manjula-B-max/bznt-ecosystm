import React, { useEffect, useState } from 'react';

import slide1 from '../assets/crm-slide-1.svg';
import slide2 from '../assets/crm-slide-2.svg';
import slide3 from '../assets/crm-slide-3.svg';
import slide4 from '../assets/crm-slide-4.svg';
import slide5 from '../assets/crm-slide-5.svg';

const slides = [
    { src: slide1, subtitle: 'Close deals faster with a clear pipeline.' },
    { src: slide2, subtitle: 'See every customer detail in one place.' },
    { src: slide3, subtitle: 'Automate follow-ups with smart workflows.' },
    { src: slide4, subtitle: 'Stay on top of calls, emails, and next steps.' },
    { src: slide5, subtitle: 'Celebrate wins and keep momentum going.' }
];

export default function CrmPane() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setFading(false);
            }, 320); // Match CSS transition duration
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="crm-pane" aria-hidden="true">
            <div className="crm-pane-inner">
                <div className="crm-image-frame">
                    <img
                        id="crmShowcaseImg"
                        className={`crm-showcase-img ${fading ? 'fade-out' : ''}`}
                        alt="CRM preview"
                        src={slides[currentSlide].src}
                    />
                </div>
                <div className="crm-caption" id="crmShowcaseCaption">
                    {slides[currentSlide].subtitle}
                </div>
            </div>
        </section>
    );
}
