"use client"

import { useState } from "react";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (): Promise<void> => {
        setLoading(true);
    }

    return (
        <>
            <div>Login</div>
            <button onClick={handleLogin}>Register</button>
        </>
    )
}