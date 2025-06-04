"use client"

import { useState } from "react";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (): Promise<void> => {
        setLoading(true);
    }

    return (
        <>
            <div>Login</div>
            <button onClick={handleLogin}>Login</button>
        </>
    )
}