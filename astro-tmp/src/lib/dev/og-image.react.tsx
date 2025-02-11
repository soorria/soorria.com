import { useCallback, useState } from "react";
import { classes } from "./utils";

export const OgImagePreview = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    const meta = document.querySelector('meta[property="og:image"]');
    const url = meta?.getAttribute("content");
    if (!url) return;
    const parsed = new URL(url);
    parsed.protocol = "http";
    parsed.host = "localhost:3000";
    parsed.searchParams.set("_date", Date.now().toString());

    setImage(parsed.toString());
  }, []);

  return (
    <>
      <button className={classes.item} onClick={handleClick}>
        og:image
      </button>

      {image && (
        <dialog
          open
          className="slide-in-direct fixed inset-0 grid h-screen place-items-center bg-drac-base-dark/75"
        >
          <div className="flex w-screen flex-col items-center bg-transparent">
            <div className="flex max-h-[90vh] max-w-(--breakpoint-lg) flex-col items-center gap-16 overflow-auto overflow-y-auto px-8 pb-64">
              <img src={image} alt="og" width={1200} height={630} />
              <img src={image} alt="og" width={600} height={312} />
              <img src={image} alt="og" width={300} height={156} />
            </div>
          </div>

          <button
            className="absolute bottom-16 rounded-sm bg-drac-pink px-2 py-1 text-drac-base transition hover:bg-drac-purple"
            onClick={() => setImage(null)}
          >
            close
          </button>
        </dialog>
      )}
    </>
  );
};
