import { FiBarChart2, FiBriefcase, FiDollarSign, FiLock, FiPieChart, FiShield, FiTarget, FiTrendingUp, FiUser } from "react-icons/fi";

import { IBenefit } from "@/types"

export const benefits: IBenefit[] = [
    {
        title: "Smart Dashboard",
        description: "Stay in control of your business with a real-time, intuitive dashboard designed for smooth daily operations.",
        bullets: [
            {
                title: "Great Classification",
                description: "Automatically sorts your transactions for crystal-clear insights.",
                icon: <FiBarChart2 size={26} />
            },
            {
                title: "Order Management",
                description: "View and manage all incoming orders efficiently, from dine-in to takeaway and delivery.",
                icon: <FiTarget size={26} />
            },
            {
                title: "Actionable Insights",
                description: "Make better decisions with data-driven reports, sales summaries, and inventory trends — all in one place.",
                icon: <FiTrendingUp size={26} />
            }
        ],
        imageSrc: "/images/mock.png"
    },
    {
        title: "Self Order",
        description: "Enjoy a seamless ordering experience right from your table. Just scan, browse the menu, and place your order — no waiting required.",
        bullets: [
            {
                title: "Browse the Menu",
                description: "Explore a wide variety of food and drinks, complete with images and descriptions — all at your fingertips.",
                icon: <FiDollarSign size={26} />
            },
            {
                title: "Order Instantly",
                description: "Add your favorite items to the cart and confirm your order in just a few taps. Fast, easy, and hassle-free.",
                icon: <FiBriefcase size={26} />
            },
            {
                title: "Track Your Order",
                description: "Stay updated with real-time order status — from kitchen preparation to delivery at your table.",
                icon: <FiPieChart size={26} />
            }
        ],
        imageSrc: "/images/profile.png"
    },
    {
        title: "Inventory Management",
        description: "Keep your stock levels accurate and up-to-date — avoid overstocking or running out.",
        bullets: [
            {
                title: "Secure Stock Tracking",
                description: "Every item movement is recorded with precision, from incoming supply to outgoing sales.",
                icon: <FiLock size={26} />
            },
            {
                title: "Barcode & QR Integration",
                description: "Scan items easily to update inventory instantly — reduce human error and speed up workflows.",
                icon: <FiUser size={26} />
            },
            {
                title: "Real-Time Alerts & Restock Reminders",
                description: "Get notified when stock is low or nearly expired, so you can restock just in time.",
                icon: <FiShield size={26} />
            }
        ],
        imageSrc: "/images/add.png"
    },
]