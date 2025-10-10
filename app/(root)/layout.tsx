import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import React from "react";


export default function Layout({ children}: Readonly<{children: React.ReactNode} >) {
    return(
        <main className="font-work-sans">
            <Navbar/>
            {children}
            <Footer/>
        </main>
    )
}