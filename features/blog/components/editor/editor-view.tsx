"use client";

import BlogEditor from "./blog-editor";
import MobileRibbon from "./ribbons/mobile-ribbon";

const EditorView = () => {
  return (
    <div className="bg-card text-card-foreground rounded-md">
      <MobileRibbon />
      <BlogEditor />
    </div>
  );
};

export default EditorView;
