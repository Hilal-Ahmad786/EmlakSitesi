// Luxury-appropriate animations - subtle, elegant, and refined
// Using cubic-bezier for smooth, professional motion

// Luxury easing curve
const luxuryEase = [0.25, 0.1, 0.25, 1];

export const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: luxuryEase }
    }
};

export const fadeInSlow = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" }
    }
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: luxuryEase }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
};

export const staggerContainerFast = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05
        }
    }
};

export const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: luxuryEase }
    }
};

export const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: luxuryEase }
    }
};

export const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: luxuryEase }
    }
};

// New luxury-specific animations

export const elegantReveal = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: luxuryEase }
    }
};

export const goldLineReveal = {
    hidden: { scaleX: 0 },
    visible: {
        scaleX: 1,
        transition: { duration: 0.8, ease: luxuryEase, delay: 0.3 }
    }
};

export const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

export const imageZoom = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.7, ease: luxuryEase }
    }
};

export const buttonPress = {
    rest: { scale: 1 },
    tap: { scale: 0.98 }
};

// Page transitions
export const pageTransition = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
    }
};

// Modal animations
export const modalOverlay = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

export const modalContent = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.4, ease: luxuryEase }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.3 }
    }
};

// Slide panel (for mobile menu, sidebars)
export const slidePanel = {
    hidden: { x: "100%" },
    visible: {
        x: 0,
        transition: { type: "spring", damping: 25, stiffness: 200 }
    },
    exit: {
        x: "100%",
        transition: { duration: 0.3, ease: "easeIn" }
    }
};

// Text reveal animation
export const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: luxuryEase
        }
    })
};

// Counter animation helper
export const counterAnimation = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};
