import { Metadata } from "next";
import Register from "@/components/Register";

export const metadata: Metadata = {
    title: "Register",
    description: "Register an account on Mangoliya",
};

export default function RegisterPage() {
    return (
        <div className="bg-background text-foreground">
            <Register />
        </div>
    );
}
