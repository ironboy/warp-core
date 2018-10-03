<Row>
  <Col className="col-12 col-lg-8 offset-lg-2 mt-5">

    <h2>Loops through lists</h2>

    <h4 className="mt-4">Our list</h4>
    <p>In the examples below we assume that we are working with this list:</p>
    <SyntaxHighlighter showLineNumbers={true} language='js' style={shstyle}>
{`this.arr = [
  {name: 'Cecilia', id: 1},
  {name: 'Dan', id: 2},
  {name: 'Eve', id: 3}
];`}
    </SyntaxHighlighter>
    <p>Our end goal is a list looking like this:</p>
    <ul>
      <Loop i={this.arr}>{item =>
        <li>{item.name}</li>
      }</Loop>
    </ul>

    <h4 className="mt-4">JavaScript</h4>
    <p>Here is a traditional <i>for...of</i> structure in <b>JavaScript</b>:</p>
    <SyntaxHighlighter showLineNumbers={true} language='js' style={shstyle}>
{`let result = '';
for(let item of this.arr){
  result += \`<p>\${item.name}</p>;\`
}`}
    </SyntaxHighlighter>
    <p>A more functional way of writing the same thing would be:</p>
    <SyntaxHighlighter showLineNumbers={true} language='js' style={shstyle}>
{`let result = this.arr.map(item => \`<li>\${item.name}</li>\`).join('');`}
    </SyntaxHighlighter>
    
    <h4 className="mt-4">"Native" jsx</h4>
    <p>In "native" <b>jsx</b> you would use <i>map</i>.</p>
    <p><b>Do note</b> that having a <i>unique</i> key for the each item is <i>very</i> important in jsx:</p>
    <SyntaxHighlighter showLineNumbers={true} language='jsx' style={shstyle}>
{`<ul> 
  {this.arr.map(item =>
    <li key={item.id}>{item.name}</li>
  )}
</ul>}`}
    </SyntaxHighlighter>
    <p><ExLink href="https://reactjs.org/docs/lists-and-keys.html">Read more about loops, list and keys in jsx</ExLink>.</p>

    <h4 className="mt-4">Jsx with a component for loops</h4>
    <p>Here we introduce a component &ndash; <b>Loop</b> &ndash; that let us do the same thing. (This is more reminiscent of how most traditional templating languages would look.)</p>
    <p>The <b>Loop</b> component will automatically add the key attribute for each item.</p>
    <p>If you prefer this approach or "native" jsx is up to you!</p>
    <SyntaxHighlighter showLineNumbers={true} language='jsx' style={shstyle}>
{`<ul>
  <Loop i={this.arr}>{item =>
    <li>{item.name}</li>
  }</Loop>
</ul>`}
    </SyntaxHighlighter>
    <p>Take a look at the code for the component <b>Loop</b>. You will find it in <i>/src/utilities</i>.</p>
  </Col>
</Row>
