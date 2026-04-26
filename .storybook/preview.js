/** @type { import('@storybook/react-vite').Preview } */
import "../src/index.css";
import { Fragment, createElement } from "react";
import { Toaster } from "sonner";

const preview = {
  decorators: [
    (Story) =>
      createElement(
        Fragment,
        null,
        createElement(Story),
        createElement(Toaster, { richColors: true, position: "bottom-right" }),
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
