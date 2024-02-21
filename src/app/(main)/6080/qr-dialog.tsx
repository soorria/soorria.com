'use client'

import * as Dialog from '@radix-ui/react-dialog'
import type { IconComponent } from '~/components/icons'

const QR: IconComponent = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      shapeRendering="crispEdges"
      {...props}
    >
      <path
        stroke="currentColor"
        d="M0 0.5h7m1 0h1m2 0h2m1 0h1m3 0h7M0 1.5h1m5 0h1m1 0h1m7 0h1m1 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m1 0h2m2 0h3m1 0h1m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m2 0h2m1 0h2m2 0h1m1 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h1m4 0h2m1 0h1m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m7 0h1m1 0h1m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M11 7.5h1m1 0h1m1 0h2M0 8.5h1m2 0h7m2 0h1m3 0h2m2 0h1m1 0h3M0 9.5h1m3 0h1m2 0h1m2 0h2m1 0h4m2 0h5M1 10.5h3m2 0h1m2 0h5m1 0h2m2 0h1m1 0h1m2 0h1M0 11.5h1m2 0h2m2 0h1m2 0h3m1 0h1m1 0h1m4 0h4M1 12.5h1m1 0h6m4 0h4m1 0h1m5 0h1M0 13.5h2m1 0h1m3 0h3m2 0h2m1 0h2m3 0h1m2 0h1M0 14.5h2m2 0h5m4 0h1m1 0h1m1 0h1m2 0h5M0 15.5h1m1 0h1m2 0h1m4 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h2m1 0h1M0 16.5h1m1 0h1m1 0h1m1 0h2m2 0h3m1 0h1m1 0h5m1 0h2M8 17.5h1m2 0h1m2 0h1m1 0h1m3 0h1m1 0h2M0 18.5h7m1 0h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m3 0h1M0 19.5h1m5 0h1m1 0h4m1 0h4m3 0h1m3 0h1M0 20.5h1m1 0h3m1 0h1m1 0h1m2 0h2m1 0h7m2 0h2M0 21.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h2m4 0h2M0 22.5h1m1 0h3m1 0h1m2 0h4m1 0h2m4 0h5M0 23.5h1m5 0h1m3 0h3m2 0h1m1 0h4m1 0h3M0 24.5h7m1 0h7m1 0h2m3 0h1m2 0h1"
      />
    </svg>
  )
}

const QRIcon: IconComponent = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" {...props}>
    <path
      fill="none"
      stroke="currentColor"
      d="M12 8.5H8.5V12M14 8.5h1m-3 6H8m3-3h3.5V15M3 3.5h1m7 0h1m-9 8h1M1.5.5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Zm8 0h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Zm-8 8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z"
    ></path>
  </svg>
)

const QRDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="focus-ring group flex items-center gap-2 rounded-lg bg-drac-base-light px-3 py-2 text-drac-pink transition-colors hover:bg-drac-base-dark hover:text-drac-purple">
        <QRIcon className="h-4 w-4 transition-transform group-hocus:-rotate-20" />
        <span>See link to here</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-drac-base-dark/75" />

        <Dialog.Content className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-screen-sm -translate-x-1/2 flex-col gap-8 rounded-lg bg-drac-base p-6 shadow-lg sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
          <Dialog.Title className="text-2xl font-bold sm:text-3xl">soorria.com/6080</Dialog.Title>

          <Dialog.Close className="absolute right-4 top-4 rounded px-1.5 text-sm text-drac-pink transition-colors hover:bg-drac-base-dark hover:text-drac-purple">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 6L6 18M6 6l12 12"
              />
            </svg>
            <span className="sr-only">close</span>
          </Dialog.Close>

          <QR className="mx-auto aspect-square w-full max-w-96" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default QRDialog
