export const createOGMarkup = (main: string, subtitle?: string): string => `
  <div class="container">
    <div class="image-wrapper">
      <img alt="" src="/logo.svg" />
    </div>
    <div class="text-wrapper">
      <div class="text-wrapper-inner">
        <p class="text--main">${main}</p>
        ${subtitle ? `<p class="text--subtitle">${subtitle}</p>` : ''}
      </div>
    </div>
  </div>
  <style>
  * {
    margin: 0;
  }
  body {
    background: #282a36;
    font-family: 'Poppins';
  }
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(/fonts/poppins-regular-latin.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F,
      U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url(/fonts/poppins-bold-latin.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F,
      U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  .container {
    position: relative;
    width: 1200px;
    height: 630px;
    overflow: hidden;
  }
  .image-wrapper {
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    transform: translateY(-50%);
  }
  .text-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
  }
  .text-wrapper-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3.5rem 0;
    width: 600px;
    background: #282a36B2;
    color: #f8f8f2;
    border-radius: 1.5rem;
  }
  .text--main {
    font-weight: 700;
    font-size: 3.75rem;
    line-height: 1;
  }
  .text--subtitle {
    margin-top: 2rem;
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  </style>
  `
