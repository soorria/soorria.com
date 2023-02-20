// import reactPlugin from '@vitejs/plugin-react'

// export const react = async (): Promise<ReturnType<typeof reactPlugin>> => {
//   const plugin = reactPlugin({})
//   return plugin.map(p => ({
//     ...p,
//     enforce: 'pre',
//     async transform(code, id) {
//       if (id.match(/\.react\.[jt]sx$/)) {
//         return p.transform.call(this, code, id)
//       }
//     },
//   }))
// }
