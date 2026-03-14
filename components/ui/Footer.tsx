import React from "react";

const Footer = () => {
  return (
    <div className="border-t bg-background py-6">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Your Opinion Matters. All rights
        reserved.
      </div>
    </div>
  );
};

export default Footer;
