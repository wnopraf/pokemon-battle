import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

test("renders Pokemon Battle heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Pokemon Battle/i);
  expect(headingElement).toBeInTheDocument();
});
