import React from "react";

const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className=' h-full flex items-center place-content-center'>
            {children}
        </div>
     );
}

export default AuthLayout;
