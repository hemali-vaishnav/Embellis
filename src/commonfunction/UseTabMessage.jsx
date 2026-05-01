// src/hooks/useTabMessage.js
import { useEffect } from "react";

export default function UseTabMessage() {
    useEffect(() => {
        const originalTitle = document.title;

        const messages = [
            "👀 Come back!",
            "💔 We miss you!",
            "🔥 Don’t miss out!"
        ];

        let i = 0;
        let interval;

        const handleVisibility = () => {
            if (document.hidden) {
                interval = setInterval(() => {
                    document.title = messages[i % messages.length];
                    i++;
                }, 1500);
            } else {
                clearInterval(interval);
                document.title = originalTitle;
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            clearInterval(interval);
        };
    }, []);
}