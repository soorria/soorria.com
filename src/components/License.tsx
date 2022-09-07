import type { ReactNode } from 'react'
import { CodeBlockCopyButton } from './mdx/utils'

const LICENSE = `
MIT License Copyright (c) 2022 Soorria Saruva

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`.trim()

type AttributionOptions = {
  url: string
  title: string
}

const getAttributionText = (opts: AttributionOptions) =>
  `
This snippet ${JSON.stringify(opts.title)} from ${JSON.stringify(opts.url)} 
was created by Soorria Saruva (https://soorria.com) and is covered under the 
MIT license found here: https://github.com/soorria/soorria.com/blob/master/LICENSE.
`.trim()

const classes = {
  pre: 'rounded whitespace-pre-wrap p-4 ring-2 ring-drac-purple overflow-x-auto',
}

const License: React.FC<{ summary: ReactNode; attribution?: AttributionOptions }> = ({
  summary,
  attribution,
}) => {
  return (
    <details className="not-prose space-y-8 rounded bg-drac-bg-dark p-4 transition-shadow">
      <summary className="focus-ring -m-4 cursor-pointer rounded p-4">
        <h2 className="ml-1 inline-block font-display font-bold">{summary}</h2>
      </summary>

      {attribution ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl">Attribution</h3>
            <CodeBlockCopyButton getText={() => getAttributionText(attribution)} />
          </div>
          <p>
            You <i>should</i> place the following attribution (and probably the license below it)
            above your copy of the code, but 🤷‍♂️.
          </p>
          <pre className={classes.pre}>
            <code>{getAttributionText(attribution)}</code>
          </pre>
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl">License</h3>
          <CodeBlockCopyButton getText={() => LICENSE} />
        </div>
        <p>
          If you want, you can (and probably should) include the entire license below. I&apos;m not
          a lawyer, though so idrk.
        </p>
        <pre className={classes.pre}>{LICENSE}</pre>
      </div>
    </details>
  )
}

export default License
