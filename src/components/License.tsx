import type { ReactNode } from 'react'

const LICENSE = `
MIT License Copyright (c) 2022 Soorria Saruva

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`.trim()

const License: React.FC<{ summary?: ReactNode }> = ({ summary = 'License' }) => {
  return (
    <details className="not-prose space-y-8 rounded bg-drac-bg-dark p-4 outline-offset-2 ring-drac-pink transition-shadow focus-within:ring">
      <summary className="-m-4 cursor-pointer rounded p-4 focus:outline-none">
        <p className="ml-1 inline-block font-display font-bold">{summary}</p>
      </summary>
      <pre className="whitespace-pre-wrap p-4">{LICENSE}</pre>
    </details>
  )
}

export default License
