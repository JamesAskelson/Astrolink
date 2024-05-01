import { useEffect, useState } from "react"


// what this hook does is return the url if the window is up and there is a url to use. this is used for getting the invite link to give to others

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true);
    }, [])

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    if(!mounted) {
        return '';
    }

    return origin
}
