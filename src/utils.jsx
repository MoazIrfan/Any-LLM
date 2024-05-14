import { Highlight, themes } from 'prism-react-renderer';

export function renderMessage(msg) {
    if (!msg.includes("```")) {
      return <p className="txt">{msg}</p>;
    }

    let codeLanguage = "jsx";
    const codeBlockStartIndex = msg.indexOf("```");
    const codeBlockEndIndex = msg.lastIndexOf("```");
    const codeBlockStart = msg.substring(codeBlockStartIndex, codeBlockStartIndex + 3);
    
    // Detect language based on the code block starting tag
    switch (codeBlockStart) {
      case "```html":
        codeLanguage = "html";
        break;
      case "```css":
        codeLanguage = "css";
        break;
      case "```javascript":
        codeLanguage = "javascript";
        break;
      // Add more cases for other languages as needed
      default:
        codeLanguage = "jsx"; // Default to JSX if not detected
        break;
    }

    const codeBlockContent = msg.substring(codeBlockStartIndex + 3, codeBlockEndIndex);

    return (
      <div>
        <p className="txt">{msg.substring(0, codeBlockStartIndex)}</p>
        <Highlight code={codeBlockContent} language={codeLanguage} theme={themes.okaidia}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        <p className="txt">{msg.substring(codeBlockEndIndex + 3)}</p>
      </div>
    );
  }