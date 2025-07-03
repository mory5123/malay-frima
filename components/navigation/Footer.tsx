import Link from "next/link"

export default function Footer () {
    return (
        <>
        <footer className="bg-[#010066] text-gray-100 text-sm py-6 px-4">
            <div className="mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                <div className="text-left">
                    <p className="text-left font-semibold">Toras Tech Corp</p>
                    <p className="font-semibold">(c) 2025 Toras Tech. All rights reserved</p>
                </div>

                <div className="text-right flex flex-col sm:items-end space-y-2">
                    <nav className="space-x-4">
                        <Link href="/" className="hover:underline">利用規約</Link>
                        <Link href="/" className="hover:underline">プライバシーポリシー</Link>
                        <Link href="/" className="hover:underline">FAQ</Link>
                    </nav>
                    <div className="text-right flex space-x-4">
                        <a href="#" target="_blank" 
                        rel="noopener noreferrer" className="hover:underline">
                        Twitter</a>
                        <a href="#" target="_blank" 
                        rel="noopener noreferrer" className="hover:underline">
                        Facebook</a>
                        <a href="#" target="_blank" 
                        rel="noopener noreferrer" className="hover:underline">
                        LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}
