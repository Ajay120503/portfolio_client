import { useRef } from "react";
import {
  Bold,
  Code,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

const toolbar = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "formatBlock", value: "h2", icon: Heading2, label: "Heading" },
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { command: "formatBlock", value: "blockquote", icon: Quote, label: "Quote" },
  { command: "formatBlock", value: "pre", icon: Code, label: "Code block" },
];

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Write here...",
  minHeight = 220,
}) => {
  const editorRef = useRef(null);

  const emitChange = () => {
    onChange?.(editorRef.current?.innerHTML || "");
  };

  const runCommand = (command, commandValue = null) => {
    editorRef.current?.focus();

    if (command === "createLink") {
      const url = window.prompt("Enter link URL");
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, commandValue);
    }

    emitChange();
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-base-300 bg-base-200/60 p-2">
        {toolbar.map(({ command, value: commandValue, icon: Icon, label }) => (
          <button
            key={`${command}-${commandValue || ""}`}
            type="button"
            onClick={() => runCommand(command, commandValue)}
            className="btn btn-ghost btn-sm btn-square rounded-xl"
            title={label}
          >
            <Icon size={16} />
          </button>
        ))}

        <div className="mx-1 h-6 w-px bg-base-300" />

        <button
          type="button"
          onClick={() => runCommand("createLink")}
          className="btn btn-ghost btn-sm btn-square rounded-xl"
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => runCommand("undo")}
          className="btn btn-ghost btn-sm btn-square rounded-xl"
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => runCommand("redo")}
          className="btn btn-ghost btn-sm btn-square rounded-xl"
          title="Redo"
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="relative">
        {!value && (
          <p className="pointer-events-none absolute left-4 top-4 text-sm text-base-content/35">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={emitChange}
          className="rich-content prose max-w-none overflow-y-auto p-4 text-base-content outline-none prose-headings:text-base-content prose-p:text-base-content/80 prose-a:text-primary prose-strong:text-base-content"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value || "" }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
