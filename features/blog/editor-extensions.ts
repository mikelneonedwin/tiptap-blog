import Color from "@tiptap/extension-color";
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from "@tiptap/extension-details";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { LinkButton } from "./components/editor/link-button";
import PasteMarkdown from "./plugins";

export const blogEditorExtensions = [
  StarterKit,
  Markdown,
  PasteMarkdown,
  Placeholder.configure({
    placeholder: "Let's get started...",
  }),
  TextStyleKit,
  TextAlign.configure({
    types: ["paragraph", "heading", "blockquote", "listItem"],
    alignments: ["left", "center", "right", "justify"],
    defaultAlignment: "left",
  }),
  Underline,
  Image,
  Youtube,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Link,
  Color,
  Highlight,
  Subscript,
  Superscript,
  TaskList,
  TaskItem,
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: "details",
    },
  }),
  DetailsSummary,
  DetailsContent,
  LinkButton,
];
