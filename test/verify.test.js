const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

let dom;
let document;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable", url: "http://localhost/" });
  document = dom.window.document;
  await new Promise((resolve) => {
    if (document.readyState === 'complete') return resolve();
    dom.window.addEventListener('load', () => resolve());
  });
});

afterAll(() => {
  if (dom && dom.window) dom.window.close();
});

describe('JavaScript in the script element', () => {
  
  it('should comment out line 14 using a single-line comment', () => {
    const scriptText = document.querySelector('body script').textContent;
    const matches = (scriptText.match(/\/\/.*total = total - 2;/g) || []).length;
    expect(matches).toBe(1);
  });

  it('should comment out lines 16, 17, and 18 using a multi-line comment', () => {
    const scriptText = document.querySelector('body script').textContent;
    const matches = (scriptText.match(/\/\*[\s\S]*?total = total - 4;[\s\S]*?total = total - 5;[\s\S]*?total = total - 6;[\s\S]*?\*\//g) || []).length;
    expect(matches).toBe(1);
  });

  it('should set the result element to 39', () => {
    const result = document.querySelector('#result').innerHTML;
    expect(result).toBe('39');
  });
});
