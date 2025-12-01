import { Link } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-primary-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Logo variant="light" />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Specializing in historic and waterfront properties in Istanbul.
                            We provide exceptional service for international buyers and investors.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-serif text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
                            <li><Link href="/neighborhoods" className="hover:text-white transition-colors">Neighborhoods</Link></li>
                            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Market Insights</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Properties */}
                    <div>
                        <h3 className="font-serif text-lg mb-6">Collections</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/properties?type=yali" className="hover:text-white transition-colors">Bosphorus Yalı</Link></li>
                            <li><Link href="/properties?type=historic" className="hover:text-white transition-colors">Historic Apartments</Link></li>
                            <li><Link href="/properties?type=penthouse" className="hover:text-white transition-colors">Luxury Penthouses</Link></li>
                            <li><Link href="/properties?type=investment" className="hover:text-white transition-colors">Investment Opportunities</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-serif text-lg mb-6">Contact</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>Bebek, Istanbul, Turkey</li>
                            <li>+90 212 123 45 67</li>
                            <li>info@maisondorient.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Maison d&apos;Orient. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
