import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black-200 text-white py-12 mt-20 font-work-sans">
            <div className="max-w-7xl mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <Image 
                                src="/logo.png" 
                                alt="logo" 
                                width={174} 
                                height={30}
                                className="brightness-0 invert"
                            />
                        </Link>
                        <p className="text-white-100 text-sm max-w-md">
                            Partagez vos idées de startup, connectez-vous avec des entrepreneurs et faites grandir votre projet.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Navigation</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-white-100 hover:text-primary transition-colors text-sm">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href="/startup/create" className="text-white-100 hover:text-primary transition-colors text-sm">
                                    Créer un Pitch
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Suivez-nous</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white-100 hover:text-primary transition-colors text-sm">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white-100 hover:text-primary transition-colors text-sm">
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white-100 hover:text-primary transition-colors text-sm">
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white-100 text-sm">
                            © {currentYear} Weeb Service. Tous droits réservés.
                        </p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-white-100 hover:text-primary transition-colors text-sm">
                                Confidentialité
                            </Link>
                            <Link href="#" className="text-white-100 hover:text-primary transition-colors text-sm">
                                Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
