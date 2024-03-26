import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Private } from "./private";

describe("Private component", () => {
  const ProtectedComponent = () => <p>Protected</p>;

  it("should render", () => {
    const component = render(
      <BrowserRouter>
        <Private isAuthenticated={true}>
          <ProtectedComponent />
        </Private>
      </BrowserRouter>,
    );
    expect(component.container).toBeInTheDocument();
    expect(screen.getByText("Protected")).toBeInTheDocument();
    component.unmount();
  });

  it("should redirect", () => {
    const component = render(
      <BrowserRouter>
        <Private isAuthenticated={false}>
          <ProtectedComponent />
        </Private>
      </BrowserRouter>,
    );

    expect(screen.queryByText("Protected")).not.toBeInTheDocument();
    component.unmount();
  });
});
