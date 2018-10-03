<Row>
  <Col className="col-12 col-lg-8 offset-lg-2 mt-5">

    <h2>If...else if... else</h2>

    <h4 className="mt-4">JavaScript</h4>
    <p>Here is a traditional <i>if...else if...else if...else</i> structure in <b>JavaScript</b>:</p>
    <SyntaxHighlighter showLineNumbers={true} language='js' style={shstyle}>
{`if(1 === 2){ alert('Alt 1'); }
else if (2 === 3){ alert('Alt 2'); }
else if (2 + 2 === 4){ alert('Alt 3'); }
else { alert('Alt 4'); }`}
    </SyntaxHighlighter>
    <p>Of course this example is very contrived, but you should be able to see that <b>"Alt 3"</b> is what will be displayed.</p>

    <h4 className="mt-4">"Native" jsx</h4>
    <p>Here is one of the ways you could rewrite the above in <b>jsx</b>. Since you can only have js <i>expressions</i> (that will be evaluted) not <i>statements</i> in jsx, this makes sense. Especially if you know how short-circuiting in JavaScript works.</p>
    <SyntaxHighlighter showLineNumbers={true} language='jsx' style={shstyle}>
{`{ 
  (1 === 2 && 
    <p>Alt 1</p>
  ) || (2 === 3 && 
    <p>Alt 2</p>
  ) || (2 + 2 === 4 && 
    <p>Alt 3</p>
  ) ||
    <p>Alt 4</p>
}`}
    </SyntaxHighlighter>
    <p><b>Note:</b> <i>jsx</i> is not a templating language, it's just compiles to pure JavaScript, where the tag parts are translated into expressions.</p>
    <p><ExLink href="https://reactjs.org/docs/conditional-rendering.html">Read more about conditional rendering in jsx</ExLink>.</p>

    <h4 className="mt-4">Jsx with components for if, else if and else</h4>
    <p>Here we introduce some components (<b>If</b>, <b>ElseIf</b>, and <b>Else</b>) that let us do the same thing. (This is more reminiscent of how most traditional templating languages would look.)</p>
    <p>If you prefer this approach or "native" jsx is up to you!</p>
    <SyntaxHighlighter showLineNumbers={true} language='jsx' style={shstyle}>
{`<If c={1 === 2}>
  <p>Alt 1</p>
  <ElseIf c={2 === 3}>
    <p>Alt 2</p>
  </ElseIf>
  <ElseIf c={2 + 2 === 4}>
    <p>Alt 3</p>
  </ElseIf>
  <Else>
    <p>Alt 4</p>
  </Else>
</If>`}
    </SyntaxHighlighter>
    <p>Take a look at the code for the components <b>If</b>, <b>ElseIf</b>, and <b>Else</b>. You will find it in <i>/src/utilities</i>.</p>
  </Col>
</Row>
