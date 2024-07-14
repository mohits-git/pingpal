import React from "react";

type Props = {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <main className="w-full min-h-screen flex justify-center items-center p-4">
      {children}
    </main>
  )
}

export default Layout
